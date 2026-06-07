export default function AIBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "gridMove 20s linear infinite",
        }}
      />

      {/* Glowing Orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          top: "-200px",
          left: "-200px",
          animation: "orbFloat 15s ease-in-out infinite",
        }}
      />

      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          top: "50%",
          right: "-150px",
          animation: "orbFloat 15s ease-in-out infinite",
          animationDelay: "-5s",
        }}
      />

      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[120px] opacity-30"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          bottom: "-300px",
          left: "30%",
          animation: "orbFloat 15s ease-in-out infinite",
          animationDelay: "-10s",
        }}
      />

      {/* Scan Line */}
      <div
        className="absolute inset-x-0 h-[200px] opacity-10"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.5), transparent)",
          animation: "scanline 8s linear infinite",
        }}
      />
    </div>
  );
}