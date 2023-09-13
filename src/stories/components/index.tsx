import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const LoaderOne = ({ spin = true }) => <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin={spin} />} />;

export const LoaderTwo = () => <Spin indicator={<LoadingOutlined style={{ color: 'white', fontSize: 10 }} spin />} />;
