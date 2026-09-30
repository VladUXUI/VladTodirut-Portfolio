/* Shared page container: every section aligns to the same left/right edges */
export function Container({
  as: Tag = "div",
  className = "",
  children,
  ...props
}: {
  as?: "div" | "section" | "header" | "footer";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`mx-auto w-full max-w-[1728px] px-24 lg:px-64 ${className}`} {...props}>
      {children}
    </Tag>
  );
}
