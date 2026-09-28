import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { test } from 'bun:test';

function setup(value = '') {
    const input = { value, placeholder: '', style: { visibility: '' } };
    const posts = Array.from({ length: 3 }, () => ({ style: { display: '' } }));
    const context = vm.createContext({
        ri: { alpha: [1, 2], alphabet: [1], beta: [1, 3], гамма: [2] },
        nb_posts: 3,
        document: {
            getElementById(id: string) {
                return id === 'search' ? input : posts[Number(id.slice(5)) - 1];
            },
        },
    });
    vm.runInContext(fs.readFileSync(path.join(import.meta.dir, '_includes/search.js'), 'utf8'), context);
    return {
        context, input,
        visible: () => posts.flatMap((post, i) => post.style.display === 'none' ? [] : [i + 1]),
    };
}

test('unmatched queries hide all posts, and clearing restores them', () => {
    const { context, visible } = setup();
    context.filter('no-such-word');
    assert.deepEqual(visible(), []);
    context.filter('');
    assert.deepEqual(visible(), [1, 2, 3]);
});

test('search is case-insensitive, supports substrings and Cyrillic, and requires every word', () => {
    const { context, visible } = setup();
    const cases: Array<[string, number[]]> = [
        ['ALP', [1, 2]], ['alpha beta', [1]], ['alpha\tbeta', [1]],
        ['alpha no-such-word', []], ['no-such-word alpha', []],
        ['ГАМ', [2]], ['  a  ', [1, 2, 3]],
    ];
    for (const [query, expected] of cases) {
        context.filter(query);
        assert.deepEqual(visible(), expected, query);
    }
});

test('the search hint is a placeholder, not editable query text', () => {
    const { context, input, visible } = setup();
    context.init_search('search');
    assert.equal(input.placeholder, 'search');
    assert.equal(input.value, '');
    assert.equal(input.style.visibility, 'visible');
    assert.deepEqual(visible(), [1, 2, 3]);
    input.value = 'beta';
    context.init_search('search');
    assert.equal(input.value, 'beta');
    assert.deepEqual(visible(), [1, 3]);
});

test('a restored query is preserved and applied during initialization', () => {
    const { context, input, visible } = setup('alpha');
    context.init_search('search');
    assert.equal(input.value, 'alpha');
    assert.deepEqual(visible(), [1, 2]);
});
