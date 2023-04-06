import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Check, Loader } from 'tabler-icons-react';
import { AnimatedRow, AnimatedTable } from './AnimateTable';
import useAudio from './useAudio';
import scannedSFX from './scanned.mp3';
import errorSFX from './error.mp3';

const schema = {
  barcode: { classes: 'p-2 flex-none w-40', name: 'Product barcode' },
  name: { classes: 'p-2 flex-auto', name: 'Product Name' },
  amount: { classes: 'p-2 flex-none w-16', name: 'Amount' },
  picked: { classes: 'p-2 flex-none w-16', name: 'Picked' },
  packed: { classes: 'p-2 flex-none w-16', name: 'Packed' },
};

interface DataType {
  barcode: string;
  code: string;
  name: string;
  amount: number;
  picked: number;
  packed: number;
}

interface PackingTableProps {
  initialData: DataType[];
  cacheKey: string;
}

const sortValues = (values: DataType[]) => {
  values.sort((a, b) => {
    if (a.amount === a.packed && b.amount !== b.packed) {
      return 1; // a should come after b
    }
    if (a.amount !== a.packed && b.amount === b.packed) {
      return -1; // a should come before b
    }
    return 0; // no sorting needed
  });
  return values;
};

const usePlayScanned = () => {
  const audio = useAudio(scannedSFX, { volume: 1, playbackRate: 1 });
  return { audio };
};

const usePlayError = () => {
  const audio = useAudio(errorSFX, { volume: 1, playbackRate: 1 });
  return { audio };
};

const getInitialData = ({
  cacheKey,
  initialData
}: {
  cacheKey: string,
  initialData: DataType[]
}) => {
  const cachedData = localStorage.getItem(cacheKey);
  if (!cachedData) {
    return initialData;;
  }
  const localData: DataType[] = JSON.parse(cachedData);
  const newData = initialData.map(item => {
    const updatedItem = localData.find(localItem => localItem.code === item.code);
    return updatedItem ? { ...item, packed: updatedItem.packed } : item;
  });
  return newData;
}

export default function PackingTable({
  initialData,
  cacheKey,
}: PackingTableProps) {
  const [initialized, setInitialized] = useState(false);
  const [values, setValues] = useState<DataType[]>([]);
  const [active, setActive] = useState<DataType | undefined>(undefined);
  const [barcode, setbarcode] = useState('');
  const [activePacked, setActivePacked] = useState(1)

  const playScanned = usePlayScanned();
  const playError = usePlayError();

  const sortedValues = useCallback(() => {
    return sortValues(values);
  }, [values]);

  useEffect(() => {
    if (!initialized) {
      setValues([...getInitialData({
        cacheKey, initialData
      })])
      setInitialized(true);
    }
  }, [initialData]);

  const handlePackChange = (input: string, max: number) => {
    if (active) {
      if (Number(input) > max) {
        playError.audio.play();
        return;
      }
      setActivePacked(Number(input));
      // setActive({ ...active, packed: Number(input) });
      playScanned.audio.play();
    }
  };

  useEffect(() => {
    const t = values.map((e) => {
      if (e.code === active?.code) {
        return { ...e, packed: active.packed };
      } else {
        return e;
      }
    });
    if (t.length > 0) {
      setValues([...t]);
    }
    const matches = t
      .filter((e) => e.barcode === barcode)
      .sort((a, b) => {
        if (a.amount !== a.packed && b.amount === b.packed) {
          return -1; // a comes first if its amount and packed are not equal, but b's are
        } else if (a.amount === a.packed && b.amount !== b.packed) {
          return 1; // b comes first if its amount and packed are not equal, but a's are
        } else {
          return 0; // leave the order as is
        }
      });
    if (matches.length > 0) {
      setActive(matches[0]);
    } else {
      setActive(undefined);
    }
  }, [barcode]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify(
          values.map((e) => {
            return {
              code: e.code,
              packed: active?.code === e.code ? active.packed : e.packed,
            };
          })
        )
      );
      if (active && active.amount === active.packed) {
        setValues(
          values.map((e) => {
            return {
              ...e,
              packed: active?.code === e.code ? active.packed : e.packed,
            };
          })
        );
      }
    }
  }, [values, active]);

  useEffect(() => {
    if (active && active.amount === activePacked) {
      const t = values.map(e => {
        if(e.code === active.code){
          return {...e, packed: activePacked}
        } else {
          return e;
        }
      })
      setValues([...t])
    }
  }, [activePacked, active])


  return (
    <div className="w-full">
      <table className="border-collapse w-full mb-5">
        <thead>
          <tr className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 mb-5">
            {Object.keys(schema).map((e, i) => (
              <td
                className={`${schema[e as keyof typeof schema].classes
                  } space-y-3`}
                key={e}
              >
                {e === 'barcode' && (
                  <input
                    className="w-36 form-input form-input-sm"
                    type="text"
                    value={barcode}
                    onChange={() => { }}
                    onPaste={(e) => setbarcode(e.clipboardData.getData('text'))}
                    placeholder="Paste barcode"
                  />
                )}
                {active && e === 'name' && <p>{active.name}</p>}
                {active && e === 'amount' && <p>{active.amount}</p>}
                {active && e === 'picked' && <p>{active.picked}</p>}
                {active && e === 'packed' && (
                  <input
                    className="w-12 form-input form-input-sm"
                    type="number"
                    min={1}
                    max={active.amount}
                    value={activePacked.toString()}
                    onChange={(e) =>
                      handlePackChange(e.target.value, active.amount)
                    }
                  />
                )}
              </td>
            ))}
          </tr>
        </thead>
      </table>
      <AnimatedTable
        classes="border-collapse border-x border-gray-200 w-full"
        values={values}
      >
        <thead>
          <tr className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border-t border-b border-gray-200">
            {Object.keys(schema).map((e, i) => (
              <td className={schema[e as keyof typeof schema].classes} key={e}>
                {schema[e as keyof typeof schema].name}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedValues().map((item, i) => (
            <AnimatedRow
              value={item}
              classes={classnames({
                'px-4 py-2 text-sm text-gray-700 border-b border-gray-200': true,
                'bg-blue-300': active?.code === item.code,
                'bg-green-300':
                  item.amount === item.packed && active?.code !== item.code,
              })}
              key={item.code}
            >
              {Object.keys(schema).map((el, j) => (
                <td
                  className={schema[el as keyof typeof schema].classes}
                  key={el}
                >
                  <div className="flex items-center space-x-2">
                    {el === 'barcode' && (
                      <>
                        {active?.code === item.code &&
                          item.amount !== item.packed ? (
                          <Loader className="animate-spin" size={15} />
                        ) : (
                          <Check
                            className={classnames({
                              'text-transparent': item.amount !== item.packed,
                              'text-gray-800': item.amount === item.packed,
                            })}
                            size={15}
                          />
                        )}
                      </>
                    )}
                    <div>{item[el as keyof typeof item]}</div>
                  </div>
                </td>
              ))}
            </AnimatedRow>
          ))}
        </tbody>
      </AnimatedTable>
    </div>
  );
}
