/**
 * APlayer 保持播放脚本
 * 确保 PJAX 跳转时音乐继续播放
 */

(function() {
  'use strict';

  console.log('[APlayer] 保持播放脚本已加载');

  // 获取播放器实例
  function getPlayer() {
    // 从 meting-js 元素获取
    const metingElements = document.querySelectorAll('meting-js');
    for (let i = 0; i < metingElements.length; i++) {
      if (metingElements[i].aplayer) {
        return metingElements[i].aplayer;
      }
    }
    
    // 从全局变量获取
    if (window.ap && window.ap.audio) {
      return window.ap;
    }
    
    // 从 DOM 查找
    const aplayerDiv = document.querySelector('.aplayer');
    if (aplayerDiv && aplayerDiv.aplayer) {
      return aplayerDiv.aplayer;
    }
    
    return null;
  }

  // 保存播放状态
  let wasPlaying = false;

  // PJAX 开始跳转时
  window.addEventListener('pjax:send', function() {
    const player = getPlayer();
    if (player && player.audio) {
      wasPlaying = !player.audio.paused;
      console.log('[APlayer] PJAX 跳转开始，播放状态:', wasPlaying ? '播放中' : '已暂停');
    }
  });

  // PJAX 跳转完成后
  window.addEventListener('pjax:complete', function() {
    // 如果之前在播放，继续播放
    if (wasPlaying) {
      setTimeout(function() {
        const player = getPlayer();
        if (player && player.audio && player.audio.paused) {
          console.log('[APlayer] 恢复播放');
          player.play().catch(function(error) {
            console.warn('[APlayer] 自动播放失败（可能需要用户交互）:', error);
          });
        }
      }, 100);
    }
  });

})();
