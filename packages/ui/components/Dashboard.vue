<script setup lang="ts">
	import { dbSize, tableCount, schemaCount, hasMultipleDatabases, databases, database, databaseById } from "@/composables/data";
	import { activeDatabase } from "@/composables/navigation";
</script>

<template>
	<div h="full" flex="~ col">
		<div p="3" h-10 flex="~ gap-2" items-center bg-header border="b base">
			<div class="i-carbon-dashboard" />
			<span pl-1 font-bold text-sm flex-auto ws-nowrap overflow-hidden truncate>Dashboard</span>
		</div>
		<div class="scrolls" flex-auto py-1>
			<div gap-0 flex="~ col gap-4" h-full justify-center items-center>
				<div bg-header rounded-lg p="y4 x2">
					<section m="y-4 x-2" w-80>
						<div flex="~ wrap" justify-evenly relative>
							<div p-2 text-center flex>
								<div grid gap="4">
									<div v-if="!hasMultipleDatabases" grid text-4xl min-w-2em>
										<span truncate>{{ database.database }} </span>
										<span text-xs truncate> @{{ database.hostPort }} </span>
									</div>
									<Select v-else v-model="activeDatabase" :options="databases" max-w-75>
										<template #selected="{ item }">
											<div grid text-4xl min-w-2em>
												<span truncate>{{ databaseById(item).database }} </span>
												<span text-xs truncate> @{{ databaseById(item).hostPort }} </span>
											</div>
										</template>
										<template #item="{ item }">
											<div text-md truncate w-75>
												<span truncate>{{ item.database }} </span>
												<span text-xs truncate> @{{ item.hostPort }} </span>
											</div>
										</template>
									</Select>
									<div text-md>Database Information</div>
								</div>
							</div>
						</div>
					</section>
					<div grid="~ cols-[min-content_1fr_min-content]" items-center gap="x-2 y-3" p="x4" relative font-light w-80 op80>
						<div i-carbon-result />
						<div>Schemas</div>
						<div id="schemaCount" class="number">{{ schemaCount }}</div>

						<div i-carbon-document />
						<div>Tables</div>
						<div id="tableCount" class="number">{{ tableCount }}</div>

						<div i-carbon-maximize />
						<div>Size</div>
						<div id="dbSize" class="number">{{ dbSize }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.number {
		font-weight: 400;
		text-align: right;
		white-space: nowrap;
	}
</style>
