import React, { useRef, useEffect } from 'react';
import { Connection } from '@/types/game';

interface ConnectionCanvasProps {
  connections: Connection[];
  onCanvasRef: (canvas: HTMLCanvasElement | null) => void;
}

export const ConnectionCanvas: React.FC<ConnectionCanvasProps> = ({ connections, onCanvasRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      onCanvasRef(canvasRef.current);
    }
  }, [onCanvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar conexões
    connections.forEach(connection => {
      drawConnection(ctx, connection);
    });
  }, [connections]);

  const drawConnection = (ctx: CanvasRenderingContext2D, connection: Connection) => {
    // Esta função será chamada pelo componente pai para desenhar as conexões
    // As coordenadas serão passadas dinamicamente
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
};