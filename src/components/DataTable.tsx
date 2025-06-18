"use client";

import { Table } from "antd";
import { createStyles } from "antd-style";
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});
export default function DataTable({
  columns,
  dataSource,
}: {
  columns: any;
  dataSource: any;
}) {
  const { styles } = useStyle();

  return (
    <div className="h-[calc(100vh-200px)] overflow-auto">
      <Table
        columns={columns}
        dataSource={dataSource}
        className={styles.customTable}
        scroll={{ x: "max-content", y: 55 * 5 }}
      />
    </div>
  );
}
