/**
 * APlayer 保持播放脚本
 * 确保 PJAX 跳转时音乐继续播放
 */

(function() {
  'use strict';

  console.log('[APlayer] 保持播放脚本已加载');

  function getPlayer() {
    const metingElements = document.querySelectorAll('meting-js');
    for (let i = 0; i < metingElements.length; i++) {
      if (metingElements[i].aplayer) return metingElements[i].aplayer;
    }
    if (window.ap && window.ap.audio) return window.ap;
    const aplayerDiv = document.querySelector('.aplayer');
    if (aplayerDiv && aplayerDiv.aplayer) return aplayerDiv.aplayer;
    return null;
  }

  function closeSearchPopup() {
    const popup = document.querySelector('.popup');
    if (popup && popup.classList.contains('show')) {
      console.log('[APlayer] 关闭搜索弹窗');
      if (popup.__closePopup) {
        popup.__closePopup();
      } else {
        popup.classList.remove('show');
        const mask = document.getElementById('mask');
        if (mask) mask.classList.add('hide');
        const container = document.getElementById('container');
        if (container) container.style.marginRight = '';
        const headerNav = document.getElementById('header-nav');
        if (headerNav) headerNav.style.marginRight = '';
        document.body.style.overflow = '';
      }
      return true;
    }
    return false;
  }

  function resumePlayback() {
    const player = getPlayer();
    if (player && player.audio && player.audio.paused) {
      console.log('[APlayer] 恢复播放');
      player.play().catch(function(error) {
        console.warn('[APlayer] 自动播放失败:', error);
      });
    }
  }

  let wasPlaying = false;
  let isPopstateNavigation = false;

  // PJAX 跳转时保存播放状态
  window.addEventListener('pjax:send', function() {
    const player = getPlayer();
    if (player && player.audio) {
      wasPlaying = !player.audio.paused;
      console.log('[APlayer] PJAX 跳转，播放状态:', wasPlaying ? '播放中' : '已暂停');
    }
  });

  // PJAX 完成后恢复播放
  window.addEventListener('pjax:complete', function() {
    console.log('[APlayer] PJAX 完成');
    if (wasPlaying) {
      setTimeout(resumePlayback, 200);
    }
  });

  // 监听浏览器前进/后退
  window.addEventListener('popstate', function() {
    console.log('[APlayer] 检测到浏览器前进/后退');
    isPopstateNavigation = true;
    
    // 延迟检查并关闭搜索弹窗
    setTimeout(function() {
      if (closeSearchPopup()) {
        console.log('[APlayer] 已关闭因前进/后退出现的搜索弹窗');
        if (wasPlaying) {
          setTimeout(resumePlayback, 200);
        }
      }
      isPopstateNavigation = false;
    }, 100);
  });

})();
