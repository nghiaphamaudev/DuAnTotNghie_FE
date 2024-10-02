import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

interface UseWindowSizeProps {
    mobileWidth?: number,
    tabletWidth?: number
}

interface WindowSize {
    width: number,
    height: number
}

interface DevicesScreen {
    mobile: boolean,
    tablet: boolean,
    desktop: boolean
}

export default function useWindowSize({ mobileWidth = 768, tabletWidth }: UseWindowSizeProps): [DevicesScreen, WindowSize] {
    // state
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const [devicesScreen, setDevicesScreen] = useState<DevicesScreen>({
        mobile: false,
        tablet: false,
        desktop: false
    });

    // lifecycle
    useEffect(() => {
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    useEffect(() => {
        if (windowSize) {
            let mobile = false, tablet = false, desktop = false;
            if (windowSize.width < mobileWidth) {
                mobile = true;
            } else if (tabletWidth && tabletWidth > 0 && windowSize.width < tabletWidth) {
                tablet = true;
            } else {
                desktop = true;
            }
            setDevicesScreen({ mobile, tablet, desktop });
        }
    }, [windowSize]);

    // function
    const onResize = useCallback(debounce((e: UIEvent) => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, 500), []);

    return [devicesScreen, windowSize];
}
