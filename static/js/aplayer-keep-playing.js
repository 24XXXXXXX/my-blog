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

  // 关闭搜索弹窗
  function closeSearchPopup() {
    const popup = document.querySelector('.popup');
    if (popup && popup.classList.contains('show')) {
      console.log('[APlayer] 检测到搜索弹窗打开，正在关闭...');
      
      // 调用弹窗的关闭方法
      if (popup.__closePopup) {
        popup.__closePopup();
      } else {
        // 手动关闭
        popup.classList.remove('show');
        const mask = document.getElementById('mask');
        if (mask) {
          mask.classList.add('hide');
        }
        const container = document.getElementById('container');
        if (container) {
          container.style.marginRight = '';
        }
        const headerNav = document.getElementById('header-nav');
        if (headerNav) {
          headerNav.style.marginRight = '';
        }
        document.body.style.overflow = '';
      }
      
      return true;
    }
    return false;
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
    // 先关闭可能存在的搜索弹窗
    const popupWasClosed = closeSearchPopup();
    
    // 如果之前在播放，继续播放
    if (wasPlaying) {
      // 如果关闭了弹窗，稍微延迟一下
      const delay = popupWasClosed ? 300 : 100;
      
      setTimeout(function() {
        const player = getPlayer();
        if (player && player.audio && player.audio.paused) {
          console.log('[APlayer] 恢复播放');
          player.play().catch(function(error) {
            console.warn('[APlayer] 自动播放失败（可能需要用户交互）:', error);
          });
        }
      }, delay);
    }
  });

  // 监听浏览器前进/后退（popstate 事件）
  window.addEventListener('popstate', function() {
    console.log('[APlayer] 检测到浏览器前进/后退');
    
    // 延迟检查并关闭搜索弹窗
    setTimeout(function() {
      const popupWasClosed = closeSearchPopup();
      
      // 如果关闭了弹窗且播放器在播放，确保继续播放
      if (popupWasClosed) {
        setTimeout(function() {
          const player = getPlayer();
          if (player && player.audio && player.audio.paused && wasPlaying) {
            console.log('[APlayer] 弹窗关闭后恢复播放');
            player.play().catch(function(error) {
              console.warn('[APlayer] 自动播放失败:', error);
            });
          }
        }, 200);
      }
    }, 100);
  });

})();
