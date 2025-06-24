export function createImageSet(sources: Record<string, string>) {
    let imageSet = '';
    const entries = Object.entries(sources);
    const countEntries = entries.length - 1;

    for (const [i, [format, source]] of entries.entries()) {
        const paths = source.split(', ');
        const countPaths = paths.length - 1;

        let split = paths?.map((path) => path.split(' ') as [string, string]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const smallestWidth = split.reduce((prev, [_, size]) => {
            if (!size?.endsWith('w')) return prev;

            const width = parseInt(size.replace('w', ''));
            return width < prev ? width : prev;
        }, Infinity);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const smallestHeight = split.reduce((prev, [_, size]) => {
            if (!size?.endsWith('h')) return prev;

            const height = parseInt(size.replace('h', ''));
            return height < prev ? height : prev;
        }, Infinity);

        for (const [j, [src, size]] of split.entries()) {
            if (!size || !src) continue;

            // turns out, only x is supported. w or h don't work
            if (size.endsWith('w'))
                imageSet += `url('${src}') type('image/${format}') ${parseInt(size.replace('w', '')) / smallestWidth}x`;
            else if (size.endsWith('h'))
                imageSet += `url('${src}') type('image/${format}') ${parseInt(size.replace('h', '')) / smallestHeight}x`;
            else imageSet += `url('${src}') type('image/${format}') ${j + 1}x`;

            if (i !== countEntries || j !== countPaths) imageSet += ', ';
        }
    }

    return `image-set(${imageSet})`;
}
