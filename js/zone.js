
function isOverflowingY(el) {
  return el.scrollHeight > el.offsetHeight;
}

function isScrollPositionNearTop(el) {
  return el.scrollTop < 10;
}

function isScrollPositionNearBottom(el) {
  return (el.scrollTop + el.offsetHeight) > (el.scrollHeight - 10);
}

function getEffectIds(el) {
  var effectIdsString = el.getAttribute("data-zs-css-effect-ids");
  if (!effectIdsString) {
    return [];
  }
  else {
    return effectIdsString.split("<|>").map(parseInt);
  }
}

function setEffectIds(el, effectIds) {
  el.setAttribute("data-zs-css-effect-ids", effectIds.map(id => ""+id).join("<|>"));
}

function addEffectId(el, effectId) {
  var effectIds = getEffectIds(el);
  effectIds.push(effectId);
  setEffectIds(el, effectIds);
}

function fadeOutEffect(element, durationMs) {
  var fadeOutEffectId = setInterval(function () {
    // Initial
    if (element.style.display !== "none") {
      element.setAttribute("data-zs-css-display", element.style.display);
    }
    if (!element.style.opacity) {
      element.style.opacity = 1;
    }

    // Evolution
    if (element.style.display !== "none" && element.style.opacity > 0) {
      element.style.opacity = parseFloat(element.style.opacity) - 0.1;
      element.setAttribute("data-zs-css-visibilitystatus", "fadingout");
    }
    else {
      clearInterval(fadeOutEffectId);
      element.style.opacity = 0;
      element.setAttribute("data-zs-css-visibilitystatus", "hidden");
      element.style.display = "none";
    }
  }, durationMs/10);
  return fadeOutEffectId;
}

function fadeInEffect(element, durationMs) {
  var fadeInEffectId = setInterval(function () {
    // Initial
    if (element.style.display === "none") {
      var originalCssDisplay = element.getAttribute("data-zs-css-display");
      if (originalCssDisplay) {
        element.style.display = originalCssDisplay;
      }
      else {
        element.style.display = "";
      }
    }
    if (!element.style.opacity) {
      element.style.opacity = 0;
    }

    // Evolution
    if (element.style.opacity < 1) {
      element.style.opacity = parseFloat(element.style.opacity) + 0.1;
      element.setAttribute("data-zs-css-visibilitystatus", "fadingin");
    }
    else {
      clearInterval(fadeInEffectId);
      element.style.opacity = 1;
      element.setAttribute("data-zs-css-visibilitystatus", "visible");
    }
  }, durationMs/10);
  return fadeInEffectId;
}

function clearEffects(el) {
  var existingEffects = getEffectIds(el);
  existingEffects.map(clearInterval);
}

function setOnlyEffect(el, effectId) {
  clearEffects(el);
  setEffectIds(el, [effectId]);
}

function setVisibility(el, value) {
  if (value) {
    el.style.opacity = 1;
    var originalCssDisplay = el.getAttribute("data-zs-css-display");
    if (originalCssDisplay) {
      el.style.display = originalCssDisplay;
    }
    else {
      el.style.display = "";
    }
    el.setAttribute("data-zs-css-visibilitystatus", "visible");
  }
  else {
    el.style.opacity = 0;
    el.style.display = "none";
    el.setAttribute("data-zs-css-visibilitystatus", "hidden");
  }
}

function updateZoneScrollIndicationStyle(doAnimation=true) {
  document.querySelectorAll(".zone").forEach(function(zone) {
    var contentWindow = zone.querySelector(".zone__content-window");
    if (isOverflowingY(contentWindow)) {
      var scrollIndicationTop = zone.querySelector(".zone__scroll-indication.--top");
      var topFadeStatus = scrollIndicationTop.getAttribute("data-zs-css-visibilitystatus");
      if (isScrollPositionNearTop(contentWindow)) {
        if (!topFadeStatus || topFadeStatus === "fadingin" || topFadeStatus === "visible") {
          if (doAnimation) {
            setOnlyEffect(scrollIndicationTop, fadeOutEffect(scrollIndicationTop, 300));
          }
          else {
            clearEffects(scrollIndicationTop);
            setVisibility(scrollIndicationTop, false);
          }
        }
      }
      else {
        if (!topFadeStatus || topFadeStatus === "fadingout" || topFadeStatus === "hidden") {
          if (doAnimation) {
            setOnlyEffect(scrollIndicationTop, fadeInEffect(scrollIndicationTop, 300));
          }
          else {
            clearEffects(scrollIndicationTop);
            setVisibility(scrollIndicationTop, true);
          }
        }
      }

      var scrollIndicationBottom = zone.querySelector(".zone__scroll-indication.--bottom");
      var bottomFadeStatus = scrollIndicationBottom.getAttribute("data-zs-css-visibilitystatus");
      if (isScrollPositionNearBottom(contentWindow)) {
        if (!bottomFadeStatus || bottomFadeStatus === "fadingin" || bottomFadeStatus === "visible") {
          if (doAnimation) {
            setOnlyEffect(scrollIndicationBottom, fadeOutEffect(scrollIndicationBottom, 300));
          }
          else {
            clearEffects(scrollIndicationBottom);
            setVisibility(scrollIndicationBottom, false);
          }
        }
      }
      else {
        if (!bottomFadeStatus || bottomFadeStatus === "fadingout" || bottomFadeStatus === "hidden") {
          if (doAnimation) {
            setOnlyEffect(scrollIndicationBottom, fadeInEffect(scrollIndicationBottom, 300));
          }
          else {
            clearEffects(scrollIndicationBottom);
            setVisibility(scrollIndicationBottom, true);
          }
        }
      }
    }
  });
}

$(function() {
  // ====== ATTACH HANDLERS ======
  $(".zone__content-window").on("scroll", updateZoneScrollIndicationStyle);

  // ====== SETUP INITIAL STATE ======
  updateZoneScrollIndicationStyle(false)
});