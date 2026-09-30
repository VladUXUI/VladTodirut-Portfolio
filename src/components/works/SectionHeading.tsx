/* Section title with the thick accent bar underneath */
export function SectionHeading({
  children,
  barClass,
  fullBar = false,
}: {
  children: React.ReactNode;
  /** Background class for the bar, e.g. "bg-accent-blue" */
  barClass: string;
  /** Bar spans the full container instead of 738px */
  fullBar?: boolean;
}) {
  return (
    <h2 className="flex flex-col items-start gap-24 text-title-2xl font-medium">
      {children}
      <span className={`h-16 w-full ${fullBar ? "" : "max-w-[738px]"} ${barClass}`} aria-hidden />
    </h2>
  );
}
