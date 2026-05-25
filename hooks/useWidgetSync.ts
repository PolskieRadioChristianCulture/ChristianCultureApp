import { useState, useEffect, useCallback } from 'react';

export type WidgetId = 
  | 'mediaplayer' 
  | 'motivation' 
  | 'didyouknow' 
  | 'golden_thoughts' 
  | 'cta_mobilization' 
  | 'yellow_card'
  | 'daily_verse'
  | 'emi_news'
  | 'music_news'
  | 'calendar'
  | 'dashboard'
  | 'verse-graphic'
  | 'radio_player'
  | 'top_header'
  | 'search_bar';

interface Position {
  x: number;
  y: number;
}
interface Size {
  width: number | string;
  height: number | string;
}

// Global state for widget synchronization
const widgetPositions: Record<string, Position & { w: number, h: number }> = {};
const widgetGroups: Record<string, string> = {}; // widgetId -> groupId
const SNAP_THRESHOLD = 30;

let listeners: ((event: any) => void)[] = [];
function emit(event: any) {
  listeners.forEach(l => l(event));
}
function subscribe(listener: any) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

export function useWidgetSync(id: WidgetId, defaultPos: Position, defaultSize: Size) {
  const [position, setPosition] = useState<Position | null>(null);
  const [size, setSize] = useState<Size>(defaultSize);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [isGroupMinimized, setIsGroupMinimized] = useState(false);

  useEffect(() => {
    const savedPos = localStorage.getItem(`cc_${id}_widget_pos`);
    const savedSize = localStorage.getItem(`cc_${id}_widget_size`);
    const savedGroup = localStorage.getItem(`cc_${id}_widget_group`);
    
    let initialPos = defaultPos;
    if (savedPos) {
      try { initialPos = JSON.parse(savedPos); } catch (e) {}
    }
    setPosition(initialPos);
    widgetPositions[id] = { ...initialPos, w: 300, h: 200 }; // rough estimated sizes initially

    if (savedSize) {
      try { 
        const s = JSON.parse(savedSize);
        setSize(s);
        widgetPositions[id].w = typeof s.width === 'number' ? s.width : 300;
        widgetPositions[id].h = typeof s.height === 'number' ? s.height : 200;
      } catch (e) {}
    }

    if (savedGroup) {
      setGroupId(savedGroup);
      widgetGroups[id] = savedGroup;
    }

    const checkMinimized = () => {
      const gId = widgetGroups[id];
      if (gId) {
        setIsGroupMinimized(localStorage.getItem(`cc_group_${gId}_minimized`) === 'true');
      } else {
        setIsGroupMinimized(false);
      }
    };
    checkMinimized();
  }, [id, defaultPos.x, defaultPos.y]);

  useEffect(() => {
    const handleSync = (e: any) => {
      // Handle group drag
      if (e.type === 'drag' && e.groupId === groupId && e.sourceId !== id) {
        setPosition(prev => {
          if (!prev) return prev;
          const newPos = { x: prev.x + e.deltaX, y: prev.y + e.deltaY };
          widgetPositions[id].x = newPos.x;
          widgetPositions[id].y = newPos.y;
          localStorage.setItem(`cc_${id}_widget_pos`, JSON.stringify(newPos));
          return newPos;
        });
      }
      // Handle group setting natively
      if (e.type === 'group_update') {
        setGroupId(widgetGroups[id] || null);
        const gId = widgetGroups[id];
        if (gId) {
          setIsGroupMinimized(localStorage.getItem(`cc_group_${gId}_minimized`) === 'true');
        } else {
          setIsGroupMinimized(false);
        }
      }
      // Handle minimization explicitly
      if (e.type === 'minimized_update') {
        const gId = widgetGroups[id];
        if (gId) {
          setIsGroupMinimized(localStorage.getItem(`cc_group_${gId}_minimized`) === 'true');
        }
      }
    };
    const unsubscribe = subscribe(handleSync);
    return unsubscribe;
  }, [id, groupId]);

  const onDrag = (e: any, d: any) => {
    if (!position) return;
    const deltaX = d.deltaX;
    const deltaY = d.deltaY;
    
    // Update local immediately so it doesn't stutter? 
    // react-rnd controls itself during drag, so changing state might fight it.
    // Actually, react-rnd `d.x` is the new position.
    // We only need to emit drag if grouped.
    if (groupId) {
      emit({ type: 'drag', sourceId: id, groupId, deltaX, deltaY });
    }
    
    // Update global positions tracking
    if (widgetPositions[id]) {
      widgetPositions[id].x = d.x;
      widgetPositions[id].y = d.y;
    }
  };

  const onDragStop = (e: any, d: any) => {
    let finalX = d.x;
    let finalY = d.y;
    
    // Bounds check with safety margin
    const SAFE_MARGIN = 20;
    const TOP_BAR_SAFE = 64;
    
    if (finalX < SAFE_MARGIN) finalX = SAFE_MARGIN;
    if (finalY < SAFE_MARGIN + TOP_BAR_SAFE) finalY = SAFE_MARGIN + TOP_BAR_SAFE;
    if (finalX > window.innerWidth - 100) finalX = window.innerWidth - 100; // at least some part visible
    if (finalY > window.innerHeight - 100) finalY = window.innerHeight - 100;

    setPosition({ x: finalX, y: finalY });
    localStorage.setItem(`cc_${id}_widget_pos`, JSON.stringify({ x: finalX, y: finalY }));
    
    if (widgetPositions[id]) {
      widgetPositions[id].x = finalX;
      widgetPositions[id].y = finalY;
      if (d.node) {
        widgetPositions[id].w = d.node.offsetWidth;
        widgetPositions[id].h = d.node.offsetHeight;
      }
    }

    // Check for snapping IF NOT GROUPED
    if (!widgetGroups[id]) {
      for (const [otherId, pos] of Object.entries(widgetPositions)) {
        if (otherId === id) continue;
        
        // Simple overlap or proximity check based on centers or edges
        // Let's use a simpler heuristic: if X is very close, and they are somewhat close in Y,
        // we snap them to a vertical stack.
        const dx = Math.abs(pos.x - finalX);
        const dy = Math.abs(pos.y - finalY);
        
        // We assume widgets are around 200-300px height.
        // We'll snap if dx < 50 and they are within 400px vertically.
        const otherH = pos.h || 220;
        const thisH = widgetPositions[id]?.h || (d.node ? d.node.offsetHeight : 220);
        const otherW = pos.w || 350;
        const thisW = widgetPositions[id]?.w || (d.node ? d.node.offsetWidth : 350);

        const isNearBottomEdge = Math.abs(finalY - (pos.y + otherH)) < 60;
        const isNearTopEdge = Math.abs((finalY + thisH) - pos.y) < 60;
        const isAlignedX = dx < 60;

        const isNearRightEdge = Math.abs(finalX - (pos.x + otherW)) < 60;
        const isNearLeftEdge = Math.abs((finalX + thisW) - pos.x) < 60;
        const isAlignedY = dy < 60;

        if ((isNearBottomEdge && isAlignedX) || (isNearTopEdge && isAlignedX) || (isNearRightEdge && isAlignedY) || (isNearLeftEdge && isAlignedY) || (dx < 50 && dy < 50)) {
           // Snap and group!
           const newGroupId = widgetGroups[otherId] || `group_${Date.now()}`;
           widgetGroups[id] = newGroupId;
           widgetGroups[otherId] = newGroupId;
           
           localStorage.setItem(`cc_${id}_widget_group`, newGroupId);
           localStorage.setItem(`cc_${otherId}_widget_group`, newGroupId);
           
           // Snap to it physically
           let snappedPos = { x: finalX, y: finalY };
           if (isNearBottomEdge && isAlignedX) {
             snappedPos = { x: pos.x, y: pos.y + otherH + 10 };
           } else if (isNearTopEdge && isAlignedX) {
             snappedPos = { x: pos.x, y: pos.y - thisH - 10 };
           } else if (isNearRightEdge && isAlignedY) {
             snappedPos = { x: pos.x + otherW + 10, y: pos.y };
           } else if (isNearLeftEdge && isAlignedY) {
             snappedPos = { x: pos.x - thisW - 10, y: pos.y };
           } else {
             // Just exact align if dropped directly on top
             snappedPos = { x: pos.x, y: pos.y + otherH + 10 };
           }
           
           setPosition(snappedPos);
           if (widgetPositions[id]) {
             widgetPositions[id].x = snappedPos.x;
             widgetPositions[id].y = snappedPos.y;
           }
           localStorage.setItem(`cc_${id}_widget_pos`, JSON.stringify(snappedPos));

           emit({ type: 'group_update' });
           break; // snapped
        }
      }
    }
  };

  const onResizeStop = (e: any, direction: any, ref: any, delta: any, pos: any) => {
    const newSize = { width: ref.style.width, height: ref.style.height };
    setSize(newSize);
    setPosition(pos);
    localStorage.setItem(`cc_${id}_widget_size`, JSON.stringify(newSize));
    localStorage.setItem(`cc_${id}_widget_pos`, JSON.stringify(pos));
    
    if (widgetPositions[id]) {
      widgetPositions[id].x = pos.x;
      widgetPositions[id].y = pos.y;
      widgetPositions[id].w = parseInt(ref.style.width) || 300;
      widgetPositions[id].h = parseInt(ref.style.height) || 200;
    }
  };

  const ungroup = () => {
    delete widgetGroups[id];
    localStorage.removeItem(`cc_${id}_widget_group`);
    setGroupId(null);
    emit({ type: 'group_update' });
  };

  const minimizeGroup = useCallback(() => {
    if (!groupId) return;
    localStorage.setItem(`cc_group_${groupId}_minimized`, 'true');
    emit({ type: 'minimized_update' });
  }, [groupId]);

  return { position, size, groupId, isGroupMinimized, onDrag, onDragStop, onResizeStop, ungroup, minimizeGroup, setPosition };
}
