<script lang="ts">
	import { tt } from '$lib/i18n';
	import InputArea, { type BadgeSegment } from '../InputArea.svelte';
	import OutputPanel from '../OutputPanel.svelte';
	import EmptyState from '../EmptyState.svelte';
	import {
		CLASSES,
		SETGID,
		SETUID,
		STICKY,
		bit,
		parseBase,
		parsePermissions,
		toOctal,
		toSymbolic,
		type PermClass,
		type PermWarning
	} from '$lib/tools/chmod';
	import { initFromHash } from '$lib/state/hashstate.svelte';
	import { currentResult } from '$lib/state/app.svelte';
	import { copyText } from '$lib/utils/format';
	import { Copy, Check } from 'lucide-svelte';

	let input = $state('');
	let baseText = $state('644');
	let directory = $state(false);
	let copied = $state('');

	initFromHash((s) => {
		if (s.input) input = s.input;
		if (s.base) baseText = s.base;
		if (s.dir === '1') directory = true;
	});

	const base = $derived(parseBase(baseText));
	const result = $derived(
		input.trim() === '' ? null : parsePermissions(input, { base: base ?? 0o644, directory })
	);
	const info = $derived(result?.ok ? result.value : null);
	/** The grid shows the parsed mode, or an empty mode before anything is typed. */
	const mode = $derived(info && info.source !== 'umask' ? info.mode : 0);

	function setMode(next: number) {
		// Keep a pasted command's file names, so the copied command still targets them.
		input = info?.targets.length ? `chmod ${toOctal(next)} ${info.targets.join(' ')}` : toOctal(next);
	}

	function toggle(mask: number) {
		setMode(mode ^ mask);
	}

	const classLabel: Record<PermClass, () => string> = {
		u: () => tt('chmOwner'),
		g: () => tt('chmGroup'),
		o: () => tt('chmOther')
	};
	const permLabel = { r: () => tt('chmRead'), w: () => tt('chmWrite'), x: () => tt('chmExec') };

	const specials = $derived([
		{ mask: SETUID, label: tt('chmSetuid') },
		{ mask: SETGID, label: tt('chmSetgid') },
		{ mask: STICKY, label: tt('chmSticky') }
	]);

	const warningText: Record<PermWarning, () => string> = {
		worldWritable: () => tt('chmWarnWorld'),
		setuid: () => tt('chmWarnSetuid'),
		setgid: () => tt('chmWarnSetgid'),
		specialNoExec: () => tt('chmWarnSpecialNoExec'),
		ownerLess: () => tt('chmWarnOwnerLess')
	};

	const target = $derived(info?.targets.length ? info.targets.join(' ') : directory ? 'dir' : 'file');

	const rows = $derived.by((): Array<[string, string]> => {
		if (!info) return [];
		if (info.umask) {
			return [
				[tt('chmUmaskFile'), `${toOctal(info.umask.file)}  ${toSymbolic(info.umask.file)}`],
				[tt('chmUmaskDir'), `${toOctal(info.umask.dir)}  ${toSymbolic(info.umask.dir)}`]
			];
		}
		const type = info.fileType ?? (directory ? 'd' : '-');
		return [
			[tt('chmOctal'), info.octal],
			[tt('chmSymbolic'), info.symbolic],
			['ls -l', type + info.symbolic],
			[tt('chmCommand'), `chmod ${info.octal} ${target}`],
			[tt('chmCommandSym'), `chmod ${info.chmodSymbolic} ${target}`]
		];
	});

	const output = $derived(rows.map(([k, v]) => `${k}: ${v}`).join('\n'));

	$effect(() => {
		currentResult.text = output;
	});

	const badge = $derived.by((): BadgeSegment[] => {
		if (!result) return [];
		if (!info) return [{ text: 'invalid', tone: 'err' }];
		if (info.source === 'umask') return [{ text: `umask ${info.octal}`, tone: 'accent' }];
		const out: BadgeSegment[] = [{ text: info.octal, tone: 'accent' }, { text: info.symbolic, tone: 'dim' }];
		if (info.base !== null) out.push({ text: `${toOctal(info.base)} →`, tone: 'dim' });
		return out;
	});

	async function copyRow(key: string, value: string) {
		await copyText(value);
		copied = key;
		setTimeout(() => {
			if (copied === key) copied = '';
		}, 1200);
	}

	const shareState = $derived.by(() => {
		if (input.trim() === '') return null;
		const s: Record<string, string> = { input };
		if (info?.base != null) s.base = baseText;
		if (directory) s.dir = '1';
		return s;
	});
</script>

<div class="space-y-4">
	<InputArea
		bind:value={input}
		label={tt('chmInput')}
		placeholder="755 · rwxr-xr-x · u=rwx,g=rx,o=rx · g+w · chmod -R 750 dir · umask 022"
		{badge}
		rows={2}
		error={result && !result.ok ? { message: result.error } : null}
		onsample={() => (input = '-rwxr-x---')}
	/>

	{#if info?.base != null}
		<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
			<label class="flex items-center gap-2 text-dim">
				{tt('chmBase')}
				<input
					type="text"
					bind:value={baseText}
					spellcheck="false"
					autocomplete="off"
					aria-invalid={base === null}
					class="w-28 rounded-lg border bg-surface-2 px-2 py-1 font-mono text-sm text-fg focus:border-accent {base === null
						? 'border-err'
						: 'border-line'}"
				/>
			</label>
			<label class="flex items-center gap-2 text-dim">
				<input type="checkbox" bind:checked={directory} class="accent-(--accent)" />
				{tt('chmDirectory')}
			</label>
		</div>
	{/if}

	{#if info?.source !== 'umask'}
		<fieldset class="rounded-lg border border-line bg-surface p-3">
			<legend class="sr-only">{tt('chmGrid')}</legend>
			<table class="w-full text-sm">
				<thead>
					<tr>
						<td></td>
						{#each ['r', 'w', 'x'] as const as p (p)}
							<th scope="col" class="pb-2 text-center text-xs font-medium tracking-wide text-dim uppercase">{permLabel[p]()}</th>
						{/each}
						<th scope="col" class="pb-2 text-right font-mono text-xs font-medium text-dim">#</th>
					</tr>
				</thead>
				<tbody>
					{#each CLASSES as c (c)}
						<tr class="border-t border-line/50">
							<th scope="row" class="py-2 pr-3 text-left font-normal">{classLabel[c]()}</th>
							{#each ['r', 'w', 'x'] as const as p (p)}
								<td class="py-2 text-center">
									<input
										type="checkbox"
										checked={(mode & bit(c, p)) !== 0}
										onchange={() => toggle(bit(c, p))}
										aria-label="{classLabel[c]()} — {permLabel[p]()}"
										class="size-4 accent-(--accent)"
									/>
								</td>
							{/each}
							<td class="py-2 text-right font-mono">{(mode >> (c === 'u' ? 6 : c === 'g' ? 3 : 0)) & 7}</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line/50 pt-3 text-sm">
				<span class="text-xs font-medium tracking-wide text-dim uppercase">{tt('chmSpecial')}</span>
				{#each specials as s (s.mask)}
					<label class="flex items-center gap-2">
						<input type="checkbox" checked={(mode & s.mask) !== 0} onchange={() => toggle(s.mask)} class="accent-(--accent)" />
						{s.label}
					</label>
				{/each}
			</div>
		</fieldset>
	{/if}

	{#if info && info.warnings.length}
		<ul class="space-y-1 text-sm text-warn" aria-live="polite">
			{#each info.warnings as w (w)}<li>⚠ {warningText[w]()}</li>{/each}
		</ul>
	{/if}

	<OutputPanel value={output} filename="permissions.txt" {shareState}>
		{#if info}
			<table class="w-full font-mono text-sm">
				<tbody>
					{#each rows as [key, value] (key)}
						<tr class="border-b border-line/50 last:border-0">
							<th scope="row" class="py-1.5 pr-4 text-left align-top font-sans font-normal whitespace-nowrap text-dim">{key}</th>
							<td class="py-1.5 break-all">{value}</td>
							<td class="w-8 py-1.5 text-right align-top">
								<button
									type="button"
									class="rounded-md p-1 text-dim transition-colors duration-120 hover:bg-surface-2 hover:text-fg"
									onclick={() => copyRow(key, value)}
									aria-label="Copy {key}"
								>
									{#if copied === key}<Check size={13} class="text-ok" />{:else}<Copy size={13} />{/if}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<EmptyState hint={tt('chmEmpty')} />
		{/if}
	</OutputPanel>
</div>
