const DrawerIcon = props => {
  const circleClass = `circle ${!!props.hovering && 'hover'}`
  return (
    <svg
      width={32}
      height={32}
      alt={'drawer'}
      viewBox="0 0 32 32"
      style={{ paddingBottom: '2px' }}
    >
      <style>
        {` 
          .circle{
            fill:#fff;
            opacity:0;
          }
          .circle.hover {
            -webkit-animation: active 1500ms ease-in-out infinite alternate;
                    animation: active 1500ms ease-in-out infinite alternate;
          }

          @-webkit-keyframes resting {
            100% {
              opacity: 0.4;
            }
          }
          @keyframes resting {
            100% {
              opacity: 0.4;
            }
          }
          @-webkit-keyframes active {
            100% {
              opacity: 0.8;
            }
          }
          @keyframes active {
            100% {
              opacity: 0.8;
            }
          }

          .circle:nth-of-type(1) {
            -webkit-animation-delay: 1188ms;
                    animation-delay: 1188ms;
          }
          .circle:nth-of-type(2) {
            -webkit-animation-delay: 35ms;
                    animation-delay: 35ms;
          }
          .circle:nth-of-type(3) {
            -webkit-animation-delay: 2150ms;
                    animation-delay: 2150ms;
          }
          .circle:nth-of-type(4) {
            -webkit-animation-delay: 324ms;
                    animation-delay: 324ms;
          }
          .circle:nth-of-type(5) {
            -webkit-animation-delay: 199ms;
                    animation-delay: 199ms;
          }
          .circle:nth-of-type(6) {
            -webkit-animation-delay: 1309ms;
                    animation-delay: 1309ms;
          }
          .circle:nth-of-type(7) {
            -webkit-animation-delay: 2603ms;
                    animation-delay: 2603ms;
          }
          .circle:nth-of-type(8) {
            -webkit-animation-delay: 1185ms;
                    animation-delay: 1185ms;
          }
          .circle:nth-of-type(9) {
            -webkit-animation-delay: 1399ms;
                    animation-delay: 1399ms;
          }    
                
          .circle.hover:nth-of-type(1) {
            -webkit-animation-delay: 401ms;
                    animation-delay: 401ms;
          }
          .circle.hover:nth-of-type(2) {
            -webkit-animation-delay: 852ms;
                    animation-delay: 852ms;
          }
          .circle.hover:nth-of-type(3) {
            -webkit-animation-delay: 1107ms;
                    animation-delay: 1107ms;
          }
          .circle.hover:nth-of-type(4) {
            -webkit-animation-delay: 631ms;
                    animation-delay: 631ms;
          }
          .circle.hover:nth-of-type(5) {
            -webkit-animation-delay: 1205ms;
                    animation-delay: 1205ms;
          }
          .circle.hover:nth-of-type(6) {
            -webkit-animation-delay: 1384ms;
                    animation-delay: 1384ms;
          }
          .circle.hover:nth-of-type(7) {
            -webkit-animation-delay: 94ms;
                    animation-delay: 94ms;
          }
          .circle.hover:nth-of-type(8) {
            -webkit-animation-delay: 542ms;
                    animation-delay: 542ms;
          }
          .circle.hover:nth-of-type(9) {
            -webkit-animation-delay: 1200ms;
                    animation-delay: 1200ms;
          }          
      `}
      </style>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#0076B9" offset="0%" />
          <stop stopColor="#C86DD7" offset="100%" />
        </linearGradient>
        <clipPath id="dots">
          <circle cx={4} cy={4} r={3.8} />
          <circle cx={16} cy={4} r={3.8} />
          <circle cx={28} cy={4} r={3.8} />
          <circle cx={4} cy={16} r={3.8} />
          <circle cx={16} cy={16} r={3.8} />
          <circle cx={28} cy={16} r={3.8} />
          <circle cx={4} cy={28} r={3.8} />
          <circle cx={16} cy={28} r={3.8} />
          <circle cx={28} cy={28} r={3.8} />
        </clipPath>
      </defs>
      <g id="group">
        <path fill="url(#gradient)" clipPath="url(#dots)" d="M0 0h40v40H0z" />
        <circle className={circleClass} cx={4} cy={4} r={4} />
        <circle className={circleClass} cx={16} cy={4} r={4} />
        <circle className={circleClass} cx={28} cy={4} r={4} />
        <circle className={circleClass} cx={4} cy={16} r={4} />
        <circle className={circleClass} cx={16} cy={16} r={4} />
        <circle className={circleClass} cx={28} cy={16} r={4} />
        <circle className={circleClass} cx={4} cy={28} r={4} />
        <circle className={circleClass} cx={16} cy={28} r={4} />
        <circle className={circleClass} cx={28} cy={28} r={4} />
      </g>
    </svg>
  )
}

export default DrawerIcon
