export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-11">
      dede
        { children }
    </div>
  );
}
