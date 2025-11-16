export function createImageSet(sources: Record<string, string>) {
    let imageSet = ''
    const entries = Object.entries(sources)
    const countEntries = entries.length - 1

    for (const [i, [format, source]] of entries.entries()) {
        const paths = source.split(', ')
        const countPaths = paths.length - 1

        const split = paths?.map((path) => path.split(' ') as [string, string])

        const smallestWidth = split.reduce((prev, [_, size]) => {
            if (!size?.endsWith('w')) return prev

            const width = parseInt(size.replace('w', ''), 10)
            return width < prev ? width : prev
        }, Infinity)

        const smallestHeight = split.reduce((prev, [_, size]) => {
            if (!size?.endsWith('h')) return prev

            const height = parseInt(size.replace('h', ''), 10)
            return height < prev ? height : prev
        }, Infinity)

        for (const [j, [src, size]] of split.entries()) {
            if (!size || !src) continue

            // turns out, only x is supported. w or h don't work
            if (size.endsWith('w'))
                imageSet += `url('${src}') type('image/${format}') ${parseInt(size.replace('w', ''), 10) / smallestWidth}x`
            else if (size.endsWith('h'))
                imageSet += `url('${src}') type('image/${format}') ${parseInt(size.replace('h', ''), 10) / smallestHeight}x`
            else imageSet += `url('${src}') type('image/${format}') ${j + 1}x`

            if (i !== countEntries || j !== countPaths) imageSet += ', '
        }
    }

    return `image-set(${imageSet})`
}
