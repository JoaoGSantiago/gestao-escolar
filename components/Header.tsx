export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10 w-full md:pl-72">
      <h2 className="text-lg font-semibold text-slate-800">
        Painel de Controle
      </h2>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-700">Marcelo Lima</p>
          <p className="text-xs text-slate-500 font-medium">
            Sistemas de Informação
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-600 shadow-sm">
          ML
        </div>
      </div>
    </header>
  );
}
