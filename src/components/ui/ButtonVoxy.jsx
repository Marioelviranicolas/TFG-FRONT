import styled, { keyframes, css } from 'styled-components';

// --- KEYFRAMES ---
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  80% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const Button = ({ 
  children = 'Button',
  onClick,
  color = '#e8e8e8',
  fontFamily = 'ClashDisplay-semibold',
  textColor = '#000000',
  outlineColor = '#000000',
  fontSize = '17px',
  hoverColor = '#fdc24c',
  hoverTextColor = '#ffffff',
  // Nuevas props para animación
  animation = 'popIn', // 'popIn' o 'fadeInUp'
  delay = '0s'
}) => {
  return (
    <StyledWrapper
      $color={color}
      $outlineColor={outlineColor}
      $fontSize={fontSize}
      $fontFamily={fontFamily}
      $textColor={textColor}
      $hoverColor={hoverColor}
      $hoverTextColor={hoverTextColor}
      $animation={animation}
      $delay={delay}
    >
      <button onClick={onClick}>
        <span className="button_top">{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Configuración de la animación */
  opacity: 0;
  animation: ${p => p.$animation === 'fadeInUp' ? fadeInUp : popIn} 0.6s cubic-bezier(0.17, 0.67, 0.83, 0.67) ${p => p.$delay} forwards;

  button {
    --button_radius: 0.75em;
    --button_color: ${p => p.$color};
    --button_outline_color: ${p => p.$outlineColor};
    font-size: ${p => p.$fontSize};
    font-family: ${p => p.$fontFamily};
    font-weight: bold;
    border: none;
    cursor: pointer;
    border-radius: var(--button_radius);
    background: var(--button_outline_color);
    transition: transform 0.3s ease; /* Para el hover del contenedor */
  }

  .button_top {
    display: block;
    box-sizing: border-box;
    border: 2px solid var(--button_outline_color);
    border-radius: var(--button_radius);
    padding: 0.75em 1.5em;
    background: var(--button_color);
    color: ${p => p.$textColor};
    transform: translateY(-0.2em);
    transition: transform 0.1s ease, background 0.2s ease, color 0.2s ease;
  }

  button:hover .button_top {
    transform: translateY(-0.33em);
    background: ${p => p.$hoverColor};
    color: ${p => p.$hoverTextColor};
  }

  /* Efecto extra al pasar el ratón para que combine con tus estilos generales */
  button:hover {
    transform: translateY(-3px);
  }

  button:active .button_top {
    transform: translateY(0);
  }
`;

export default Button;
