import { useState } from "react";
import PropTypes from "prop-types";

StarRating.propTypes = {
  maxRating: PropTypes.number,
};

export default function StarRating({
  maxRating = 10,
  color = "#fcc419",
  size = 48,
  defaultrating = 0,
  onSetRating,
}) {
  // Style

  //Strictly limited maxrating
  // maxRating = maxRating > 5 ? (maxRating = 5) : maxRating;

  const containerStyle = { display: "flex", alignItems: "center", gap: "16px" };
  const starcontainerstyle = { display: "flex", gap: "4px" };
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };
  const textStyleForFont = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 2}px`,
  };

  const messages = ["Terrible", "Bad", "So so", "Good", "Amazing"];

  const [rating, setRating] = useState(defaultrating);
  const [temprating, setTemprating] = useState(0);

  // Handler
  onSetRating(rating);

  return (
    <div style={containerStyle}>
      <div style={starcontainerstyle}>
        {Array.from({ length: maxRating }, (_, i) => {
          return (
            <Star
              color={textStyle.color}
              size={textStyle.fontSize}
              Enter={() => {
                setTemprating(i + 1);
              }}
              Leave={() => {
                setTemprating(0);
              }}
              key={i}
              clickHandler={() => {
                setRating(i + 1);
              }}
              full={temprating ? temprating >= i + 1 : rating >= i + 1}
            ></Star>
          );
        })}
      </div>
      <p style={textStyleForFont}>{temprating ? temprating : rating}</p>
    </div>
  );
}

function Star(props) {
  const starStyle = {
    width: props.size,
    height: props.size,
    display: "block",
    cursor: "pointer",
  };

  return (
    <span
      onMouseEnter={props.Enter}
      onMouseLeave={props.Leave}
      onClick={props.clickHandler}
      role="button"
      style={starStyle}
    >
      {props.full === true ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={props.color}
          stroke={props.color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={props.color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
