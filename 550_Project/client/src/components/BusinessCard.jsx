import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Modal, Typography, Tooltip } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Legend } from 'recharts';

export default function BusinessCard({ business_id, handleClose }) {
  const [businessData, setBusinessData] = useState({});
  const [barPie, setBarPie] = useState(true); // 切换图表展示形式

  useEffect(() => {
    console.log("Current selectedBusinessId:", business_id)
    fetch(`http://localhost:8080/api/business/single-business?business_id=${business_id}`)
      .then(res => res.json())
      .then(resJson => {
        setBusinessData(resJson);
      });
  }, [business_id]);

  const chartData = [
    { name: '1 Star', value: businessData.star1_count },
    { name: '2 Stars', value: businessData.star2_count },
    { name: '3 Stars', value: businessData.star3_count },
    { name: '4 Stars', value: businessData.star4_count },
    { name: '5 Stars', value: businessData.star5_count },
  ];

  const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#845EC2'];

  const handleGraphChange = () => {
    setBarPie(!barPie);
  };

  const truncateText = (text, maxLength = 150) => {
    return text && text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={2}
        style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #ccc',
          width: '500px',
        }}
      >
        {/* 商家基本信息 */}
        <Typography variant="h5" gutterBottom>{businessData.name}</Typography>
        <Typography variant="body2" gutterBottom><strong>Address:</strong> {businessData.address}</Typography>
        <Typography variant="body2" gutterBottom><strong>Average Stars:</strong> {businessData.avg_star}</Typography>
        <Typography variant="body2" gutterBottom><strong>Review Count:</strong> {businessData.review_count}</Typography>

        {/* 最有用评论部分 */}
        {businessData.most_useful_text && (
          <Box
            sx={{
              backgroundColor: '#F0F8FF',
              padding: '12px',
              marginTop: '12px',
              borderRadius: '8px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Most Useful Review
            </Typography>
            <Tooltip title={businessData.most_useful_text} placement="top" arrow>
              <Typography
                variant="body2"
                sx={{
                  fontStyle: 'italic',
                  color: '#555',
                  lineHeight: 1.4,
                }}
              >
                {truncateText(businessData.most_useful_text, 150)}
              </Typography>
            </Tooltip>
            <Typography variant="body2" sx={{ color: '#888', marginTop: '4px' }}>
              Useful Votes: {businessData.most_useful_count}
            </Typography>
          </Box>
        )}

        {/* 切换按钮 */}
        <ButtonGroup style={{ marginTop: '12px' }}>
          <Button disabled={barPie} onClick={handleGraphChange}>Bar Chart</Button>
          <Button disabled={!barPie} onClick={handleGraphChange}>Pie Chart</Button>
        </ButtonGroup>

        {/* 图表部分 */}
        <div style={{ margin: 16 }}>
          <ResponsiveContainer width="100%" height={250}>
            {barPie ? (
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 30, right: 20, top: 10, bottom: 10 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Bar dataKey="value" stroke="#8884d8" fill="#8884d8" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 关闭按钮 */}
        <Button
          onClick={handleClose}
          style={{
            display: 'block',
            margin: '0 auto',
            marginTop: '12px',
            backgroundColor: '#4D96FF',
            color: 'white',
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
