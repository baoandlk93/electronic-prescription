import { Form, Input, Button, Select } from "antd";
import { useEffect, useState } from "react";

export default function AddressForm({ onSuccess }: { onSuccess?: (data: any) => void }) {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    fetchProvinces();
    form.resetFields();
  }, []);

  const fetchProvinces = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROVINCE_URL}`);
    const data = await response.json();
    setProvinces(data);
  };

  const fetchWards = async (provinceId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROVINCE_URL}w`);
    const data = await response.json();
    const wards = data.filter((w: any) => w.province_code === provinceId);
    setWards(wards);
  };
  const handleSubmit = (values: any) => {
    // Gọi hàm onSuccess với dữ liệu từ form
    const address = {
      ...values,
      province: provinces.find((p: any) => p.code === values.province).name,
      ward: wards.find((w: any) => w.code === values.ward).name,
    }
    if (onSuccess) {
      onSuccess(address);
    }
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Tỉnh/Thành phố" name="province" rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố" }]}>
        <Select
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={provinces.map((p) => ({ label: p.name, value: p.code }))}
          onChange={(value: string) => {
            fetchWards(value);
            console.log(value, "value");
            form.setFieldsValue({
              province: value,
              ward: undefined,
            });
          }}
        />
      </Form.Item>
      <Form.Item label="Xã/Phường" name="ward" rules={[{ required: true, message: "Vui lòng chọn Xã/Phường." }]}>
        <Select
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={wards.map((w) => ({ label: w.name, value: w.code }))}
          onChange={(value: string) => {
            form.setFieldsValue({
              ward: value,
            });
          }}
        />
      </Form.Item>
      <Form.Item label="Địa chỉ chi tiết" name="address" rules={[{ required: true, message: "Vui lòng nhập Địa chỉ chi tiết" }]}>
        <Input />
      </Form.Item>
      <Form.Item> <Button type="primary" htmlType="submit">Lưu</Button></Form.Item>
    </Form>
  );
}