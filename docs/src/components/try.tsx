import React, { useEffect } from 'react';
import { useControls, Leva, useCreateStore, LevaPanel } from 'leva';

export default function DrawModel(props) {
  const store = useCreateStore();

  const fov = 15;

  const config: any = {
    fov: {
      value: fov,
      min: -50,
      max: 50,
      step: 1,
      onChange: (_) => {},
    },
  };

  useControls(config, {
    store: store,
  });

  useEffect(() => {
    console.log('mount');
  }, []);

  return (
    <div className="live-wrap">
      <div className="leva-wrap">
        <Leva fill></Leva>
        <LevaPanel store={store} fill></LevaPanel>
      </div>
    </div>
  );
}
