export default function RobotVisual() {
  return (
    <div className="relative z-[3] mx-auto w-[min(58vw,300px)] md:w-[min(30vw,340px)] lg:w-[min(24vw,360px)]">
      <div className="robot-float">
        <img
          src="/assets/robot/eve-full.png"
          alt="Робот-ассистент Zetronix — парящий андроид с бирюзовой оптикой"
          draggable={false}
          className="h-auto w-full select-none"
        />
      </div>
    </div>
  );
}
