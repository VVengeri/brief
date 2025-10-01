import React, { useRef, useEffect, useState, useCallback } from 'react';
import { IFile, IAnnotation } from '../types';

interface PlanEditorProps {
    file: IFile;
    mode: 'electrics' | 'annotate';
    onSave: (newContent: string, annotations: IAnnotation[]) => void;
    onClose: () => void;
}

type Tool = 'socket' | 'switch' | 'lan' | 'tv' | 'text' | 'move' | 'arrow' | 'frame' | 'line';

const iconSources = {
    socket: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxsaW5lIHgxPSIxMiIgeTE9IjgiIHgyPSIxMiIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjgiIHkxPSIxNiIgeDI9IjEwIiB5Mj0iMTYiPjwvbGluZT48bGluZSB4MT0iMTQiIHkxPSIxNiIgeDI9IjEviIgeTI9IjE2Ij48L2xpbmU+8L3N2Zz4=',
    switch: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxwYXRoIGQ9Im0xNSAxNSA1LTVNLjUgNC41bDUgNSI+PC9wYXRoPjwvc3ZnPg==',
    lan: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iMTQiIHdpZHRoPSIxOCIgaGVpZ2h0PSI3IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iNiIgeTE9IjE0IiB4Mj0iNiIgeTI9IjEwIj48L2xpbmU+PGxpbmUgeDE9IjEwIiB5MT0iMTQiIHgyPSIxMCIgeTI9IjEwIj48L2xpbmU+PGxpbmUgeDE9IjE0IiB5MT0iMTQiIHgyPSIxNCIgeTI9IjEwIj48L2xpbmU+PGxpbmUgeDE9IjE4IiB5MT0iMTQiIHgyPSIxOCIgeTI9IjEwIj48L2xpbmU+PGxpbmUgeDE9IjEyIiB5MT0iMTAiIHgyPSIxMiIgeTI9IjMiPjwvcG9seWdvbj48cG9seWdvbiBwb2ludHM9IjggMyAxNiAzIDEyIDciPjwvcG9seWdvbj48L3N2Zz4=',
    tv: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMiIgeT0iNyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48cG9seWxpbmUgcG9pbnRzPSIxNyAyIDcgMiAxMiA3Ij48L3BvbHlsaW5lPjwvc3ZnPg==',
    text: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIxIDE1YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjVBMiAyIDAgMCAxIDUgM2gxNGExIDEgMCAwIDEgMSAxdjEiPjwvcGF0aD48cGF0aCBkPSJNNi41IDE0aDExTTEyIDE0VjcuNSI+PC9wYXRoPjwvc3ZnPg==',
    move: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNSAxNSA5IDEyIDEyIDE1IDE1IDEyIDEyIDkgMTUgNiAxMiAzIDkgNiAxMiA5Ij48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9IjkgMTggMTIgMjEgMTUgMTggMTIgMTUgOSAxOCI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPSIxNSAxOCA5IDE4Ij48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9IjE1IDEyIDIzIDEyIj48L3BvbHlsaW5lPjxwb2x5bGluZSBwb2ludHM9IjkgMTIgMSAxMiI+PC9wb2x5bGluZT48L3N2Zz4=',
    arrow: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGxpbmUgeDE9IjUiIHkxPSIxMiIgeDI9IjE5IiB5Mj0iMTIiPjwvbGluZT48cG9seWxpbmUgcG9pbnRzPSIxMiA1IDE5IDEyIDEyIDE5Ij48L3BvbHlsaW5lPjwvc3ZnPg==',
    frame: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48L3N2Zz4=',
    line: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGxpbmUgeDE9IjUiIHkxPSIxOSIgeDI9IjE5IiB5Mj0iNSI+PC9saW5lPjwvc3ZnPg=='
};

const toolColors: Record<Tool, string> = {
    socket: '#ef4444', // red-500
    switch: '#f97316', // orange-500
    tv: '#3b82f6',     // blue-500
    lan: '#22c55e',    // green-500
    text: '#8b5cf6',   // violet-500
    arrow: '#eab308',  // yellow-500
    frame: '#ec4899',  // pink-500
    line: '#06b6d4',   // cyan-500
    move: '#64748b',   // slate-500
};

const textColors = ['#FFFFFF', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6'];
const fontSizes = { Small: 24, Medium: 32, Large: 48 };

const iconSize = 32;
const icons: { [key in Tool]?: HTMLImageElement } = {};

Object.keys(iconSources).forEach(keyStr => {
    const key = keyStr as Tool;
    icons[key] = new Image(iconSize, iconSize);
    icons[key]!.src = iconSources[key];
});

const drawArrow = (ctx: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number, color: string) => {
    const headlen = 15; // length of head in pixels
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
};

export const PlanEditor: React.FC<PlanEditorProps> = ({ file, mode, onSave, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [history, setHistory] = useState<{
        past: IAnnotation[][];
        present: IAnnotation[];
        future: IAnnotation[][];
    }>({
        past: [],
        present: file.annotations || [],
        future: [],
    });
    const { present: annotations } = history;
    const [activeTool, setActiveTool] = useState<Tool | null>(null);
    const [textInput, setTextInput] = useState<{ x: number, y: number, screenX: number, screenY: number, value: string } | null>(null);
    const [dragging, setDragging] = useState<{ index: number; offsetX: number; offsetY: number; startAnnotations: IAnnotation[] } | null>(null);
    const [drawingState, setDrawingState] = useState<{ startX: number, startY: number, type: 'arrow' | 'frame' | 'line' } | null>(null);
    const [currentTextColor, setCurrentTextColor] = useState('#FFFFFF');
    const [currentTextSize, setCurrentTextSize] = useState(fontSizes.Medium);
    const textInputRef = useRef<HTMLInputElement>(null);

    const setAnnotations = (newAnnotations: IAnnotation[], fromHistory: boolean = false) => {
        if (fromHistory) {
            setHistory(h => ({ ...h, present: newAnnotations }));
            return;
        }

        if (JSON.stringify(newAnnotations) === JSON.stringify(history.present)) return;

        const newPast = [...history.past, history.present];
        if (newPast.length > 3) {
            newPast.shift(); // Limit history to 3 steps
        }
        setHistory({
            past: newPast,
            present: newAnnotations,
            future: [],
        });
    };
    
    const undo = useCallback(() => {
        if (history.past.length === 0) return;
        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, history.past.length - 1);
        const newFuture = [history.present, ...history.future];
        if (newFuture.length > 3) newFuture.pop();
        setHistory({ past: newPast, present: previous, future: newFuture });
    }, [history]);

    const redo = useCallback(() => {
        if (history.future.length === 0) return;
        const next = history.future[0];
        const newFuture = history.future.slice(1);
        const newPast = [...history.past, history.present];
        if (newPast.length > 3) newPast.shift();
        setHistory({ past: newPast, present: next, future: newFuture });
    }, [history]);

    const draw = useCallback((previewCoords?: {x: number, y: number}) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            annotations.forEach(ann => {
                if (ann.type === 'text') {
                    ctx.fillStyle = ann.color || toolColors.text;
                    ctx.font = `bold ${ann.fontSize || fontSizes.Medium}px Arial`;
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 2;
                    ctx.strokeText(ann.text || '', ann.x, ann.y);
                    ctx.fillText(ann.text || '', ann.x, ann.y);
                } else if (ann.type === 'arrow' && ann.x2 != null && ann.y2 != null) {
                    drawArrow(ctx, ann.x, ann.y, ann.x2, ann.y2, ann.color || toolColors.arrow);
                } else if (ann.type === 'line' && ann.x2 != null && ann.y2 != null) {
                    ctx.strokeStyle = ann.color || toolColors.line;
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(ann.x, ann.y);
                    ctx.lineTo(ann.x2, ann.y2);
                    ctx.stroke();
                } else if (ann.type === 'frame' && ann.width != null && ann.height != null) {
                    ctx.strokeStyle = ann.color || toolColors.frame;
                    ctx.lineWidth = 4;
                    ctx.strokeRect(ann.x, ann.y, ann.width, ann.height);
                } else {
                    const icon = icons[ann.type];
                    if (!icon) return;
                    
                    ctx.beginPath();
                    ctx.arc(ann.x, ann.y, iconSize / 2, 0, 2 * Math.PI, false);
                    ctx.fillStyle = toolColors[ann.type];
                    ctx.fill();

                    if(icon.complete) {
                       ctx.drawImage(icon, ann.x - iconSize / 2, ann.y - iconSize / 2, iconSize, iconSize);
                    } else {
                        icon.onload = () => {
                             ctx.drawImage(icon, ann.x - iconSize / 2, ann.y - iconSize / 2, iconSize, iconSize);
                        }
                    }
                }
            });
            
            if (drawingState && previewCoords) {
                if (drawingState.type === 'arrow') {
                    drawArrow(ctx, drawingState.startX, drawingState.startY, previewCoords.x, previewCoords.y, currentTextColor);
                } else if (drawingState.type === 'line') {
                    ctx.strokeStyle = currentTextColor;
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(drawingState.startX, drawingState.startY);
                    ctx.lineTo(previewCoords.x, previewCoords.y);
                    ctx.stroke();
                } else if (drawingState.type === 'frame') {
                    ctx.strokeStyle = currentTextColor;
                    ctx.lineWidth = 4;
                    ctx.strokeRect(drawingState.startX, drawingState.startY, previewCoords.x - drawingState.startX, previewCoords.y - drawingState.startY);
                }
            }
        };
        img.src = file.content;
    }, [file.content, annotations, drawingState, currentTextColor]);

    useEffect(() => {
        draw();
    }, [draw, annotations]);

    useEffect(() => {
        if (textInput && textInputRef.current) {
            textInputRef.current.focus();
        }
    }, [textInput]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    undo();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    redo();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const getCanvasCoords = (e: React.MouseEvent<HTMLElement>) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const getAnnotationAt = (x: number, y: number): number => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return -1;
        const tolerance = 10;
        for (let i = annotations.length - 1; i >= 0; i--) {
            const ann = annotations[i];
            if (ann.type === 'text') {
                 ctx.font = `bold ${ann.fontSize || fontSizes.Medium}px Arial`;
                 const metrics = ctx.measureText(ann.text || '');
                 const width = metrics.width;
                 const height = ann.fontSize || fontSizes.Medium;
                 if (x >= ann.x && x <= ann.x + width && y >= ann.y - height && y <= ann.y) {
                    return i;
                 }
            } else if (ann.type === 'frame' && ann.width != null && ann.height != null) {
                const { x: ax, y: ay, width: aw, height: ah } = ann;
                const onTop = y > ay - tolerance && y < ay + tolerance && x > ax && x < ax + aw;
                const onBottom = y > ay + ah - tolerance && y < ay + ah + tolerance && x > ax && x < ax + aw;
                const onLeft = x > ax - tolerance && x < ax + tolerance && y > ay && y < ay + ah;
                const onRight = x > ax + aw - tolerance && x < ax + aw + tolerance && y > ay && y < ay + ah;
                if (onTop || onBottom || onLeft || onRight) return i;
            } else if ((ann.type === 'arrow' || ann.type === 'line') && ann.x2 != null && ann.y2 != null) {
                const { x: x1, y: y1, x2, y2 } = ann;
                const dx = x2 - x1;
                const dy = y2 - y1;
                if (dx === 0 && dy === 0) continue;
                const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
                const closestX = t < 0 ? x1 : t > 1 ? x2 : x1 + t * dx;
                const closestY = t < 0 ? y1 : t > 1 ? y2 : y1 + t * dy;
                const dist = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
                if (dist < tolerance) return i;
            } else {
                const dist = Math.sqrt((x - ann.x) ** 2 + (y - ann.y) ** 2);
                if (dist <= iconSize / 2) return i;
            }
        }
        return -1;
    };
    
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const { x, y } = getCanvasCoords(e);

        if (activeTool === 'move') {
            const index = getAnnotationAt(x, y);
            if (index !== -1) {
                setDragging({ index, offsetX: x - annotations[index].x, offsetY: y - annotations[index].y, startAnnotations: annotations });
            }
        } else if (activeTool === 'arrow' || activeTool === 'frame' || activeTool === 'line') {
            setDrawingState({ startX: x, startY: y, type: activeTool });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (dragging !== null) {
            const { x, y } = getCanvasCoords(e);
            const newAnns = annotations.map((ann, i) => {
                if (i === dragging.index) {
                    const newX = x - dragging.offsetX;
                    const newY = y - dragging.offsetY;
                    const dx = newX - ann.x;
                    const dy = newY - ann.y;

                    if ((ann.type === 'arrow' || ann.type === 'line') && ann.x2 != null && ann.y2 != null) {
                        return { ...ann, x: newX, y: newY, x2: ann.x2 + dx, y2: ann.y2 + dy };
                    }
                    return { ...ann, x: newX, y: newY };
                }
                return ann;
            });
            setHistory(h => ({ ...h, present: newAnns }));
        } else if (drawingState !== null) {
            const { x, y } = getCanvasCoords(e);
            draw({ x, y });
        }
    };
    
    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (drawingState) {
            const { x, y } = getCanvasCoords(e);
            const newAnnotation: Partial<IAnnotation> = {
                type: drawingState.type,
                color: currentTextColor,
            };

            if (drawingState.type === 'arrow' || drawingState.type === 'line') {
                newAnnotation.x = drawingState.startX;
                newAnnotation.y = drawingState.startY;
                newAnnotation.x2 = x;
                newAnnotation.y2 = y;
            } else if (drawingState.type === 'frame') {
                newAnnotation.x = Math.min(drawingState.startX, x);
                newAnnotation.y = Math.min(drawingState.startY, y);
                newAnnotation.width = Math.abs(x - drawingState.startX);
                newAnnotation.height = Math.abs(y - drawingState.startY);
            }

            if ((newAnnotation.width ?? 10) > 5 || (newAnnotation.height ?? 10) > 5 || (drawingState.type === 'arrow' || drawingState.type === 'line')) {
               setAnnotations([...annotations, newAnnotation as IAnnotation]);
            }
            
            setDrawingState(null);
            draw();
            return;
        }
        
        if (dragging) {
            const { startAnnotations } = dragging;
            const newPast = [...history.past, startAnnotations];
            if (newPast.length > 3) newPast.shift();
            setHistory(h => ({ ...h, past: newPast, future: [] }));
            setDragging(null);
            return;
        }

        if (!activeTool || activeTool === 'move') return;

        const { x, y } = getCanvasCoords(e);

        if (activeTool === 'text') {
             setTextInput({ x, y, screenX: e.clientX, screenY: e.clientY, value: '' });
             setActiveTool(null);
        } else {
            setAnnotations([...annotations, { x, y, type: activeTool }]);
        }
    };

    const handleTextInputConfirm = () => {
        if (textInput && textInput.value.trim() !== '') {
            const newAnnotation: IAnnotation = {
                x: textInput.x, y: textInput.y, type: 'text',
                text: textInput.value.trim(), color: currentTextColor, fontSize: currentTextSize
            };
            setAnnotations([...annotations, newAnnotation]);
        }
        setTextInput(null);
    };

    const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleTextInputConfirm();
        else if (e.key === 'Escape') setTextInput(null);
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const newContent = canvas.toDataURL(file.type);
        onSave(newContent, annotations);
    };

    const electricsTools: { type: Tool, label: string }[] = [
        { type: 'socket', label: 'Розетка' }, { type: 'switch', label: 'Выключатель' },
        { type: 'lan', label: 'Интернет' }, { type: 'tv', label: 'ТВ' }
    ];
    const annotationTools: { type: Tool, label: string }[] = [
        { type: 'text', label: 'Текст' }, { type: 'line', label: 'Линия' },
        { type: 'arrow', label: 'Стрелка' }, { type: 'frame', label: 'Рамка' },
        { type: 'move', label: 'Переместить' }
    ];

    const tools = mode === 'electrics' ? [...electricsTools, ...annotationTools] : annotationTools;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="w-full h-full max-w-7xl max-h-[95vh] bg-[#212121] rounded-lg shadow-2xl flex flex-col">
                <div className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-wheat">Редактор плана</h2>
                    <div>
                        <button onClick={handleSave} className="px-4 py-2 bg-wheat text-gray-900 rounded-md hover:bg-wheat-200 transition-colors mr-2">Сохранить</button>
                        <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">Закрыть</button>
                    </div>
                </div>

                <div className="flex-grow flex p-4 overflow-hidden gap-4">
                    <div className="w-48 flex-shrink-0 bg-gray-800/50 rounded-lg p-2 flex flex-col items-center gap-2">
                        {tools.map(tool => (
                            <button key={tool.type} onClick={() => setActiveTool(tool.type)}
                                className={`w-full p-2 flex items-center rounded-md transition-colors ${activeTool === tool.type ? 'bg-wheat text-gray-900' : 'hover:bg-gray-700'}`}>
                                <div className="w-8 h-8 flex items-center justify-center rounded mr-2" style={{ backgroundColor: toolColors[tool.type] }}>
                                    <img src={iconSources[tool.type]} alt={tool.label} className="w-6 h-6"/>
                                </div>
                                <span className="text-sm font-semibold">{tool.label}</span>
                            </button>
                        ))}

                        {(activeTool === 'text' || activeTool === 'arrow' || activeTool === 'frame' || activeTool === 'line') && (
                            <div className="w-full p-2 mt-auto border-t border-gray-700">
                                <div className="mb-2">
                                    <span className="text-xs font-bold text-gray-400">ЦВЕТ</span>
                                    <div className="flex justify-around mt-1">
                                        {textColors.map(color => (
                                            <button key={color} onClick={() => setCurrentTextColor(color)} className={`w-6 h-6 rounded-full border-2 ${currentTextColor === color ? 'border-wheat' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                                        ))}
                                    </div>
                                </div>
                                {activeTool === 'text' && (
                                <div>
                                    <span className="text-xs font-bold text-gray-400">РАЗМЕР</span>
                                    <div className="flex justify-between mt-1 text-xs">
                                         {Object.entries(fontSizes).map(([name, size]) => (
                                             <button key={name} onClick={() => setCurrentTextSize(size)} className={`px-2 py-1 rounded ${currentTextSize === size ? 'bg-wheat text-gray-900' : 'hover:bg-gray-700'}`}>{name[0]}</button>
                                         ))}
                                    </div>
                                </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="relative flex-grow bg-gray-900/50 rounded-lg flex items-center justify-center overflow-auto">
                        <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
                           className={`max-w-full max-h-full object-contain ${activeTool === 'move' ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-crosshair'}`} />

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg p-1 flex gap-2">
                             <button onClick={undo} disabled={history.past.length === 0}
                                className="p-3 flex items-center justify-center rounded-full transition-colors text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed" title="Отменить (Ctrl+Z)">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>
                            </button>
                             <button onClick={redo} disabled={history.future.length === 0}
                                className="p-3 flex items-center justify-center rounded-full transition-colors text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed" title="Вернуть (Ctrl+Y)">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {textInput && (
                <div style={{ position: 'fixed', left: `${textInput.screenX}px`, top: `${textInput.screenY}px` }} className="z-50">
                    <input ref={textInputRef} type="text" value={textInput.value}
                        onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
                        onBlur={handleTextInputConfirm} onKeyDown={handleTextInputKeyDown}
                        className="bg-gray-900 text-white border-2 border-wheat p-2 rounded shadow-lg"
                        placeholder="Введите текст..."/>
                </div>
            )}
        </div>
    );
};