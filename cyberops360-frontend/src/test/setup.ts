import '@testing-library/jest-dom'

class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	value: ResizeObserverMock,
})

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	}),
})

const originalConsoleError = console.error
const originalConsoleWarn = console.warn

const isRechartsSizeWarning = (value: unknown) =>
	typeof value === 'string' && value.includes('The width(0) and height(0) of chart should be greater than 0')

console.error = (...args: unknown[]) => {
	const firstArg = args[0]
	if (isRechartsSizeWarning(firstArg)) {
		return
	}

	originalConsoleError(...args)
}

console.warn = (...args: unknown[]) => {
	const firstArg = args[0]
	if (isRechartsSizeWarning(firstArg)) {
		return
	}

	originalConsoleWarn(...args)
}
