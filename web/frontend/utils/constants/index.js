export const OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: true,
          color: '#F2F2F2',
        },
        showLine: false,
        ticks: {
          // stepSize: 3,
          precision: 0,
          color: '#999CA0',
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          color: '#F2F2F2',
        },
        ticks: {
          maxTicksLimit:
            typeof window != 'undefined' && (window.innerWidth < 768 ? 6 : 30),
          maxRotation: 0,
          minRotation: 0,
          color: '#999CA0',
          font: {
            size: 10,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.5,
      },
      point: {
        radius: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };