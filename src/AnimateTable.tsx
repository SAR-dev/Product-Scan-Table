import {
  Reorder,
  useMotionValue,
  motion,
  AnimatePresence,
} from 'framer-motion';
import { CSSProperties, ReactNode } from 'react';

export const AnimatedRow = ({
  value,
  children,
  classes,
  ...rest
}: {
  value: any;
  classes?: string;
  children: ReactNode;
}) => {
  const y = useMotionValue(0);

  return (
    <Reorder.Item
      as="tr"
      value={value}
      id={value}
      style={{ y }}
      dragListener={false}
      className={classes}
    >
      {children}
    </Reorder.Item>
  );
};

export const AnimatedTable = ({
  values,
  children,
  classes,
  style,
}: {
  children: ReactNode;
  values: any[];
  classes?: string;
  style?: CSSProperties;
}) => {
  return (
    <Reorder.Group
      as="table"
      axis="y"
      onReorder={() => {}}
      values={values}
      className={classes}
      style={style}
    >
      {children}
    </Reorder.Group>
  );
};
