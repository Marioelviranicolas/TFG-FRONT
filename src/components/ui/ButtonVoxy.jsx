import styled from 'styled-components';

const Button = ({ 
  children = 'Button',
  onClick,
  color = '#e8e8e8',
  fontFamily = 'ClashDisplay-semibold',
  textColor = '#000000',
  outlineColor = '#000000',
  fontSize = '17px',
}) => {
  return (
    <StyledWrapper
    $color={color}
    $outlineColor={outlineColor}
    $fontSize={fontSize}
    $fontFamily={fontFamily}
    $textColor={textColor}
    >
      <button onClick={onClick}>
        <span className="button_top">{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
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
  button:active .button_top {
    transform: translateY(0);
  }
`;

export default Button;