export default function DesignSystem({ tokens }){
  return (
    <div className="p-4 pb-24">
      <h2 className="text-lg font-medium">Mini Design System</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 shadow">
          <p className="text-sm font-medium">Colors</p>
          <div className="flex gap-2 mt-2">
            {Object.entries(tokens.colors).map(([k,v]) => (
              <div key={k} className="text-center">
                <div className="w-10 h-10 rounded-lg" style={{background:v}}/>
                <p className="text-xs mt-1">{k}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow">
          <p className="text-sm font-medium">Typography</p>
          <p className="text-[24px] mt-2">Heading H1</p>
          <p className="text-[18px]">Heading H2</p>
          <p className="text-[16px]">Body</p>
          <p className="text-[14px] text-gray-600">Small</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow">
          <p className="text-sm font-medium">Buttons</p>
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-2 rounded-xl bg-[#A7C7E7]">Primary</button>
            <button className="px-3 py-2 rounded-xl border">Secondary</button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow">
          <p className="text-sm font-medium">Cards</p>
          <div className="mt-2 bg-[#EDE6F2] rounded-xl p-3">Example content</div>
        </div>
      </div>
    </div>
  )
}
