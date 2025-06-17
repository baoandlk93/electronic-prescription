"use client";

import { Table } from "antd";

export default function DataTable({
  columns,
  dataSource,
}: {
  columns: any;
  dataSource: any;
}) {
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
}
