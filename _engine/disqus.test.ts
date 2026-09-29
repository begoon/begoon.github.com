import { test, expect } from 'bun:test';
import fs from 'node:fs';
import vm from 'node:vm';

function setup(hasObserver = true, hasThread = true) {
    const scripts: any[] = [];
    let callback: (entries: { isIntersecting: boolean }[]) => void;
    let disconnected = false;
    let observed: unknown;
    let options: unknown;
    const thread = {};
    class Observer {
        constructor(cb: typeof callback, opts: unknown) { callback = cb; options = opts; }
        observe(target: unknown) { observed = target; }
        disconnect() { disconnected = true; }
    }
    const context: any = {
        document: {
            getElementById: () => hasThread ? thread : null,
            createElement: () => ({}),
            head: { appendChild: (script: unknown) => scripts.push(script) },
        },
        disqus_shortname: 'demin-ws',
        disqus_script: 'embed.js',
        disqus_identifier: '/original/thread/',
        disqus_url: 'https://demin.ws/original/thread/',
    };
    if (hasObserver) context.IntersectionObserver = Observer;
    context.window = context;
    vm.runInNewContext(fs.readFileSync(`${import.meta.dir}/_site/js/disqus.js`, 'utf8'), context);
    return { scripts, context, thread, get observed() { return observed; }, get options() { return options; }, get disconnected() { return disconnected; }, intersect: (visible: boolean) => callback([{ isIntersecting: visible }]) };
}

test('comments load only near the viewport and only once', () => {
    const state = setup();
    expect(state.scripts).toHaveLength(0);
    expect(state.observed).toBe(state.thread);
    expect(state.options).toEqual({ rootMargin: '300px' });
    state.intersect(false);
    expect(state.scripts).toHaveLength(0);
    state.intersect(true);
    state.intersect(true);
    expect(state.scripts).toHaveLength(1);
    expect(state.scripts[0].src).toBe('https://demin-ws.disqus.com/embed.js');
    expect(state.disconnected).toBe(true);
    expect(state.context.disqus_identifier).toBe('/original/thread/');
    expect(state.context.disqus_url).toBe('https://demin.ws/original/thread/');
});

test('browsers without IntersectionObserver load comments immediately', () => {
    expect(setup(false).scripts).toHaveLength(1);
});

test('pages without a comment container do not load Disqus', () => {
    expect(setup(true, false).scripts).toHaveLength(0);
});
