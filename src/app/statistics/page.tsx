"use client";
import { DatePicker, Select, Row, Col } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import StatisticsChart from "@/components/StatisticsChart";

const { RangePicker } = DatePicker;

export default function StatisticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [type, setType] = useState<"day" | "month" | "year">("day");
  const [range, setRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams({
        type,
        ...(range
          ? {
              start: range[0].format("YYYY-MM-DD"),
              end: range[1].format("YYYY-MM-DD"),
            }
          : {}),
      });
      const res = await fetch(`/api/statistics?${params.toString()}`);
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, [type, range]);

  return (
    <div className="p-16 max-h-screen overflow-hidden mx-auto bg-gray-50 text-gray-900">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col>
          <Select value={type} onChange={setType} style={{ width: 150 }}>
            <Select.Option value="day">Theo ngày</Select.Option>
            <Select.Option value="month">Theo tháng</Select.Option>
            <Select.Option value="year">Theo năm</Select.Option>
          </Select>
        </Col>
        <Col>
          <RangePicker
            value={range}
            onChange={setRange}
            allowClear
            format="YYYY-MM-DD"
          />
        </Col>
      </Row>
      <StatisticsChart data={data} />
    </div>
  );
}
