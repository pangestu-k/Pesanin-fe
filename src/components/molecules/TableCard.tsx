import React from "react";
import { Tag, Tooltip } from "antd";
import {
  QrcodeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { Table } from "../../types";
import { TABLE_STATUS } from "../../configs/api";

interface TableCardProps {
  table: Table;
  onEdit?: (table: Table) => void;
  onDelete?: (table: Table) => void;
  onViewQR?: (table: Table) => void;
}

const TableCard: React.FC<TableCardProps> = ({
  table,
  onEdit,
  onDelete,
  onViewQR,
}) => {
  const isAvailable = table.status === TABLE_STATUS.AVAILABLE;

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 card-hover border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${
              isAvailable
                ? "bg-gradient-to-br from-green-400 to-green-500 text-white"
                : "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
            }`}
          >
            {table.table_number}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              Meja {table.table_number}
            </h3>
            <Tag color={isAvailable ? "success" : "warning"} className="mt-1">
              {isAvailable ? "Tersedia" : "Terisi"}
            </Tag>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <Tooltip title="Lihat QR Code">
          <button
            onClick={() => onViewQR?.(table)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors"
          >
            <QrcodeOutlined />
            <span className="text-sm font-medium">QR Code</span>
          </button>
        </Tooltip>

        <Tooltip title="Edit">
          <button
            onClick={() => onEdit?.(table)}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <EditOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Hapus">
          <button
            onClick={() => onDelete?.(table)}
            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
          >
            <DeleteOutlined />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default TableCard;
