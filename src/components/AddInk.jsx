/* eslint-disable react-hooks/exhaustive-deps */
import DrawerWrapper from "@/shared/Drawer";
import Button from "@/widgets/Button";
import Input from "@/widgets/Input";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { inkSchema } from "@/schema/ink";
import AddSubItem from "@/components/ink/AddSubItem";
import { post } from "@/api";

const defaultValues = {
  name: undefined,
  percentage: 100,
  pigments: undefined,
  products: undefined,
};

const AddInk = ({
  open = false,
  loading = false,
  editData = null,
  setOpen = () => {},
  setLoading = () => {},
  setEditData = () => {},
  getData = async () => {},
}) => {
  const formProps = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(inkSchema),
  });

  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    getValues,
  } = formProps;

  const handleClear = async () => {
    await getData();
    setOpen(false);
    setLoading(false);
    setTimeout(() => setEditData(null), 200);
  };

  const formatValue = (value) => {
    return Number(parseFloat(value ?? 0).toFixed(2));
  };

  const generatePayload = async (arr, name) => {
    const obj = { price: 0, percentage: 0 };
    const items = await arr?.map((item) => {
      const price = formatValue(item?.price);
      const percentage = formatValue(item?.percentage);
      const totalPrice = formatValue(price * percentage);
      obj.price = formatValue(obj.price + totalPrice);
      obj.percentage = formatValue(obj.percentage + percentage);
      return {
        [name]: item?.value,
        price,
        percentage,
        totalPrice,
      };
    });
    return { items, ...obj };
  };

  const getPayload = async ({ name, ...values }) => {
    const {
      items: products,
      price: productPrice,
      percentage: productPer,
    } = await generatePayload(values.products, "product");
    const {
      items: pigments,
      price: pigmentPrice,
      percentage: pigmentPer,
    } = await generatePayload(values.pigments, "pigment");
    const price = formatValue((productPrice + pigmentPrice) / 100);
    const percentage = formatValue(productPer + pigmentPer);
    const payload = {
      name,
      price,
      pigments,
      products,
      percentage,
    };
    return payload;
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = await getPayload(values);
      await post({
        module: "ink",
        action: values?._id ? "update" : "create",
        parameters: [values?._id],
        data: payload,
      });
    } catch (error) {
      console.error("Add Ink Error: ", error);
      setLoading(false);
    } finally {
      setLoading(false);
      handleClear();
    }
  };

  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          ...editData,
          pigments: [
            ...(editData.pigments ?? [])?.map((item) => ({
              ...item,
              label: item?.pigment?.name,
              value: item?.pigment?._id,
            })),
          ],
          products: [
            ...(editData.products ?? [])?.map((item) => ({
              ...item,
              label: item?.product?.name,
              value: item?.product?._id,
            })),
          ],
        });
      } else {
        reset({ ...defaultValues });
      }
    }
  }, [editData, open]);

  const handleRemove = (index, name) => {
    const list = getValues(`${name}s`)?.filter((_, idx) => idx !== index);
    setValue(`${name}s`, list);
  };

  const handleAdd = (name) => {
    const item = getValues(name) || {};
    const itemPer = parseFloat(getValues(`${name}Per`));
    const items = [
      ...(getValues(`${name}s`) || []),
      {
        ...item,
        percentage: itemPer,
      },
    ];
    setValue(name, null);
    setValue(`${name}s`, items);
    setValue(`${name}Per`, undefined);
  };

  return (
    <DrawerWrapper
      title={editData ? "Update Ink" : "Add Ink"}
      modalFooter={
        <>
          <Button outline onClick={handleClear}>
            Cancel
          </Button>
          <Button
            loading={loading}
            className="border border-primary"
            onClick={handleSubmit(onSubmit)}
          >
            {editData ? "Update" : "Save"}
          </Button>
        </>
      }
      open={open}
      setOpen={setOpen}
    >
      <div className="space-y-3">
        <Input
          label={"Name"}
          placeholder="Enter Name"
          rest={register("name")}
          error={errors.name?.message}
        />
        <AddSubItem
          {...formProps}
          name="pigment"
          handleAdd={handleAdd}
          handleRemove={handleRemove}
        />
        <AddSubItem
          {...formProps}
          name="product"
          handleAdd={handleAdd}
          handleRemove={handleRemove}
        />
      </div>
    </DrawerWrapper>
  );
};

export default AddInk;
