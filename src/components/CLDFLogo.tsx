import logo from '../../icon/icon.jpg'

const CLDFLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <img
      src={logo}
      alt=""
      width={52}
      height={52}
      className="size-[52px] shrink-0 rounded-full bg-white object-cover shadow-[0_2px_12px_rgba(0,0,0,0.18)]"
    />
    <div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: 'white', letterSpacing: '0.04em', lineHeight: 1.2 }}>CÂMARA LEGISLATIVA</div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.06em' }}>DO DISTRITO FEDERAL</div>
    </div>
  </div>
)


export default CLDFLogo
