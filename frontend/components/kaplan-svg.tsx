type IconProps = {
  width: number;
  height: number;
};

const KaPlanIcon = (props: IconProps) => {
  return (
    <svg
      version="1.1"
      id="svg1"
      width={props.width}
      height={props.height}
      viewBox="0 0 32 32"
    >
      <defs id="defs1">
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath16">
          <g id="use16" />
        </clipPath>
      </defs>
      <g transform="translate(2.2212974,17.227187)">
        <path
          fill="currentColor"
          d="m -0.06697,12.933031 h 28.000001 v -2 H -0.06697 Z"
        />
        <path
          fill="currentColor"
          d="m -0.06697,9.933031 2,-2 V -10.06697 h -1 l 4.0000001,-4.97226 4.0000005,4.97226 h -1 l -0.00937,4 -3.9906347,5.3424121 0,2.6575889 h 1 v 8 z"
        />
        <path
          fill="currentColor"
          d="m 14.93683,-12.06697 -0.0038,-2 h -1 v -1 h 1 v -1 h 1 v 1 h 1 v 1 h -1 v 2 z"
        />
        <path
          fill="currentColor"
          d="M 12.932999,-11.067031 4.9329995,-0.06703075 v 1 h 1 L 5.9505776,9.9329692 H 20.932999 v -9.99999995 z m -0.999969,7.0000615 h 2 l 0,3 -2,-0.019175 z m 4,6 V 8.9330306 H 9.9330302 V 1.9330305 Z"
        />
        <path
          fill="currentColor"
          d="m 13.933031,-11.06697 8,11.000001 v 10 h 5 v -9 h 1 v -1 l -9,-11.000001 z"
        />
      </g>
    </svg>
  );
};

export default KaPlanIcon;
