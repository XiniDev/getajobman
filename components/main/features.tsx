export function Features() {
  const featureList = [
    {
      icon: "🎯",
      title: "AI Job Matchmaker",
      description: "Scrapes thousands of listings daily. We filter out the junk and present only the roles that match your exact skills, salary, and vibe.",
    },
    {
      icon: "✍️",
      title: "Smart Cover Letters",
      description: "Generates highly personalized cover letters using your master CV, instantly tailored to the specific company you are applying for.",
    },
    {
      icon: "⚡",
      title: "1-Click Auto-Fill",
      description: "Bypass soul-crushing ATS portals like Workday and Greenhouse. The system injects your data directly into the browser fields.",
    },
    {
      icon: "📊",
      title: "Inbox Tracking",
      description: "Automatically reads incoming emails to track rejections and interview requests, updating your personal stats in real-time.",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mt-32 w-full">
      {featureList.map((feature, index) => (
        <div 
          key={index} 
          className="flex flex-col gap-3 p-8 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-4xl mb-2">{feature.icon}</div>
          <h3 className="font-bold text-xl">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </section>
  );
}
