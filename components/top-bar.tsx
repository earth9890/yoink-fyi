import { Icon } from "@/components/icon";
import { Dot } from "@/components/atoms";

export function TopBar() {
  return (
    <div style={{position:'sticky',top:0,zIndex:5,backdropFilter:'blur(14px)',background:'rgba(8,8,10,0.72)',borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1240,margin:'0 auto',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div className="row" style={{gap:14}}>
          <div className="row" style={{gap:8}}>
            <div style={{width:22,height:22,border:'1px solid var(--paper)',borderRadius:6,display:'grid',placeItems:'center'}}>
              <Icon name="logo" size={12}/>
            </div>
            <div style={{fontWeight:600,letterSpacing:'-0.01em',fontSize:15}}>Yoink<span style={{color:'var(--mute)',fontWeight:400}}>.fyi</span></div>
          </div>
          <span className="micro" style={{marginLeft:10,padding:'3px 8px',border:'1px solid var(--line)',borderRadius:'var(--r-pill)'}}>v0.4 · beta</span>
        </div>
        <div className="row" style={{gap:22}}>
          <a className="micro" href="#" style={{color:'var(--paper-2)',cursor:'pointer'}}>Pricing</a>
          <a className="micro" href="#" style={{color:'var(--paper-2)',cursor:'pointer'}}>API</a>
          <a className="micro" href="#" style={{color:'var(--paper-2)',cursor:'pointer'}}>Changelog</a>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 10px 6px 12px',border:'1px solid var(--line-2)',borderRadius:'var(--r-pill)'}}>
            <Dot tone="acid"/>
            <span className="mono" style={{fontSize:11,color:'var(--paper-2)'}}>2,418 today</span>
          </div>
          <button title="Sign in" style={{display:'flex',alignItems:'center',gap:6,padding:'7px 12px',border:'1px solid var(--paper)',borderRadius:'var(--r-pill)',background:'var(--paper)',color:'var(--ink)',fontWeight:500,fontSize:12.5}}>
            Sign in <Icon name="arrow" size={12}/>
          </button>
        </div>
      </div>
    </div>
  );
}
