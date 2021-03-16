declare const bar: (options: {
    grid: {
        map: (arg0: (gri: any, index: any) => any) => void;
    };
    series: {
        [x: string]: {
            coordinates: number[];
        };
    };
}, serie: any, coordinateSystem: {
    dataToPoint: (arg0: any) => any;
}) => any;
export default bar;
