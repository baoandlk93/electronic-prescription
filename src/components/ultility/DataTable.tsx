"use client";

import { Table } from "antd";
import { createStyles } from "antd-style";

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table {
        .ant-table-container {
          .ant-table-body,
          .ant-table-content {
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
    <div className="h-[calc(100vh-200px)] overflow-hidden">
      <Table
        columns={columns}
        dataSource={dataSource}
        className={styles.customTable}
        scroll={{ x: "1200", y: 55 * 5 }} // x: nên set số, ví dụ 1200 hoặc "max-content"
        sticky
      />
    </div>
  );
}
