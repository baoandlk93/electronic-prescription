import { Select } from "antd";
import { PaperSize } from "@/types/PaperSize";

interface PaperSizeSelectProps {
  size: PaperSize | undefined;
  setSize: (size: PaperSize) => void;
}

const options = [
  { value: "A3", label: "A3" },
  { value: "A4", label: "A4" },
  { value: "A5", label: "A5" },
  { value: "A6", label: "A6" },
];

const PaperSizeSelect: React.FC<PaperSizeSelectProps> = ({ size, setSize }) => (
  <Select<PaperSize>
    placeholder="Chọn kích thước giấy"
    value={size}
    onChange={(value) => setSize(value as PaperSize)}
    options={options}
    style={{ width: 200 }}
    allowClear
  />
);

export default PaperSizeSelect;
