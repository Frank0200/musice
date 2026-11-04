import assert from 'node:assert/strict'
import test from 'node:test'
import { createDubePanelPusher, resolveChatNodes } from '../src/client/music-panel-bridge.ts'

const sampleNodes = [
  { kind: 'user', seq: 1, content: [{ type: 'text', text: 'hello' }] },
  { kind: 'assistant', seq: 2, turn: 1, blocks: [{ kind: 'text', text: 'world' }] },
]

test('resolveChatNodes reads v2 session.chat.legacy.nodes', () => {
  assert.equal(resolveChatNodes({ legacy: { nodes: sampleNodes } }), sampleNodes)
})

test('resolveChatNodes reads v3 ChatSnapshot.legacy.nodes', () => {
  const chat = {
    legacy: { nodes: sampleNodes },
    nodes: { values: () => [{ kind: 'stale' }] },
  }
  assert.equal(resolveChatNodes(chat), sampleNodes)
})

test('resolveChatNodes invokes v3 nodes.values() when legacy.nodes is absent', () => {
  const fromStore = [{ kind: 'user', seq: 3, content: [{ type: 'text', text: 'via store' }] }]
  assert.deepEqual(resolveChatNodes({ nodes: { values: () => fromStore } }), fromStore)
})

test('resolveChatNodes does not treat nodes.values as an array when it is a method', () => {
  assert.equal(resolveChatNodes({ nodes: { values: () => undefined } }), null)
  assert.equal(resolveChatNodes(null), null)
  assert.equal(resolveChatNodes(undefined), null)
})

test('panel pusher replays the full snapshot after an iframe reload reset', () => {
  const batches: unknown[][] = []
  const pusher = createDubePanelPusher((events) => {
    batches.push(events)
    return true
  })

  assert.equal(pusher.push(sampleNodes), 2)
  assert.equal(pusher.push(sampleNodes), 0)

  pusher.reset()
  assert.equal(pusher.push(sampleNodes), 2)
  assert.equal(batches.length, 2)
})

test('panel pusher can reset before a new session whose seq starts lower', () => {
  const batches: unknown[][] = []
  const pusher = createDubePanelPusher((events) => {
    batches.push(events)
    return true
  })

  assert.equal(pusher.push([{ ...sampleNodes[0], seq: 50 }]), 1)
  pusher.reset()
  assert.equal(pusher.push(sampleNodes), 2)
  assert.equal(batches.length, 2)
})
