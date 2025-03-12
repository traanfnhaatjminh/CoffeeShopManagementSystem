import { AppstoreOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import { Option } from 'antd/es/mentions';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// const { Option } = Select;
const FilterTable = ({ searchText, setFilterStatus, setSearchText, setSelectedZone, zones, setViewMode, viewMode }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-lg font-bold px-2 font-lauren border bg-brown-900 text-white border-brown-400 rounded-lg">
        Danh sách bàn
      </h1>
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Tìm kiếm bàn"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select defaultValue="all" style={{ width: 120 }} onChange={(value) => setFilterStatus(value)}>
          <Option value="all">Tất cả</Option>
          <Option value="available">Trống</Option>
          <Option value="occupied">Đang dùng</Option>
        </Select>
        <Select defaultValue="all" style={{ width: 120 }} onChange={(value) => setSelectedZone(value)}>
          <Option value="all">Tất cả khu vực</Option>
          {zones.map((zone) => (
            <Option key={zone} value={zone}>
              {zone}
            </Option>
          ))}
        </Select>
        <Button onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}>
          {viewMode === 'grid' ? <AppstoreOutlined /> : <UnorderedListOutlined />}
        </Button>
        <Button onClick={() => navigate('/cashier/tablelist/managerTable')}>Quản lý bàn</Button>
      </div>
    </div>
  );
};

export default FilterTable;
