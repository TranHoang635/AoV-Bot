module.exports = (client) => {
    console.log('Bot Online ✅');
    // Thiết lập trạng thái hoạt động của bot
    const setActivity = () => {
      const activityName = `${client.ws.ping}ms`;
      client.user.setActivity({
        type: 'STREAMING',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        name: activityName,
      });
    };
    setActivity();
    setInterval(setActivity, 2000);
  };