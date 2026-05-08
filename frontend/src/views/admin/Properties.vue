<template>
  <AdminLayout>
    <div class="properties-page">
      <div class="toolbar">
        <input v-model="keyword" placeholder="搜索房源..." @keyup.enter="fetchList" />
        <button class="btn btn-primary" @click="showForm = true">新增房源</button>
      </div>

      <table class="property-table card">
        <thead>
          <tr>
            <th>标题</th>
            <th>类型</th>
            <th>区域</th>
            <th>价格</th>
            <th>状态</th>
            <th>推荐</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in list" :key="p.id">
            <td>{{ p.title }}</td>
            <td>{{ p.type }}</td>
            <td>{{ p.area }}</td>
            <td>{{ p.price }}</td>
            <td>
              <select :value="p.status" @change="updateStatus(p, ($event.target as HTMLSelectElement).value)">
                <option>在售</option>
                <option>已售</option>
                <option>已租</option>
              </select>
            </td>
            <td>
              <input type="checkbox" :checked="p.hot === 1" @change="toggleHot(p)" />
            </td>
            <td>
              <button class="btn-small" @click="editProperty(p)">编辑</button>
              <button class="btn-small danger" @click="deleteProperty(p)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 新增/编辑弹窗 -->
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal card">
          <h3>{{ editing ? '编辑房源' : '新增房源' }}</h3>
          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <div class="field">
                <label>标题 *</label>
                <input v-model="form.title" required />
              </div>
              <div class="field">
                <label>类型 *</label>
                <select v-model="form.type" required>
                  <option>新房</option>
                  <option>二手房</option>
                  <option>租房</option>
                </select>
              </div>
              <div class="field">
                <label>区域 *</label>
                <input v-model="form.area" required />
              </div>
              <div class="field">
                <label>地址 *</label>
                <input v-model="form.address" required />
              </div>
              <div class="field">
                <label>价格 *</label>
                <input v-model="form.price" placeholder="350万 或 5000/月" required />
              </div>
              <div class="field">
                <label>面积</label>
                <input v-model="form.area_sqm" placeholder="120㎡" />
              </div>
              <div class="field">
                <label>户型</label>
                <input v-model="form.rooms" placeholder="3室2厅1卫" />
              </div>
              <div class="field">
                <label>楼层</label>
                <input v-model="form.floor" placeholder="中层/18层" />
              </div>
            </div>
            <div class="field">
              <label>描述</label>
              <textarea v-model="form.desc" rows="3"></textarea>
            </div>
            <div class="field">
              <label>图片</label>
              <input type="file" accept="image/*" multiple @change="onFileChange" />
              <div class="image-preview" v-if="imagePreviews.length">
                <div v-for="(img, i) in imagePreviews" :key="i" class="preview-item">
                  <img :src="img" />
                  <button type="button" @click="removeImage(i)">&times;</button>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="closeForm">取消</button>
              <button type="submit" class="btn btn-primary">{{ editing ? '保存' : '新增' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../api';
import type { Property } from '../../types';
import AdminLayout from '../../components/AdminLayout.vue';

const list = ref<Property[]>([]);
const keyword = ref('');
const showForm = ref(false);
const editing = ref<Property | null>(null);
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);
const existingKeys = ref('');

const defaultForm = {
  title: '', type: '二手房', area: '', address: '', price: '',
  area_sqm: '', rooms: '', floor: '', desc: '', hot: 0, status: '在售',
};
const form = ref({ ...defaultForm });

async function fetchList() {
  const params: any = { pageSize: 100 };
  if (keyword.value) params.keyword = keyword.value;
  const res = await api.get('/admin/properties', { params });
  list.value = res.data.data;
}

function editProperty(p: Property) {
  editing.value = p;
  form.value = {
    title: p.title, type: p.type, area: p.area, address: p.address,
    price: p.price, area_sqm: p.area_sqm || '', rooms: p.rooms || '',
    floor: p.floor || '', desc: p.desc || '', hot: p.hot, status: p.status,
  };
  existingKeys.value = p.image_keys || '';
  imageFiles.value = [];
  imagePreviews.value = [];
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  editing.value = null;
  form.value = { ...defaultForm };
  imageFiles.value = [];
  imagePreviews.value = [];
  existingKeys.value = '';
}

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  for (const file of Array.from(files)) {
    imageFiles.value.push(file);
    const reader = new FileReader();
    reader.onload = (ev) => imagePreviews.value.push(ev.target?.result as string);
    reader.readAsDataURL(file);
  }
}

function removeImage(i: number) {
  imageFiles.value.splice(i, 1);
  imagePreviews.value.splice(i, 1);
}

async function submitForm() {
  const newKeys: string[] = [];
  for (const file of imageFiles.value) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/admin/upload', fd);
    newKeys.push(res.data.key);
  }
  const allKeys = [existingKeys.value, ...newKeys].filter(Boolean).join(',');

  const payload = { ...form.value, image_keys: allKeys };
  if (editing.value) {
    await api.put(`/admin/properties/${editing.value.id}`, payload);
  } else {
    await api.post('/admin/properties', payload);
  }
  closeForm();
  fetchList();
}

async function updateStatus(p: Property, status: string) {
  await api.put(`/admin/properties/${p.id}`, { status });
  p.status = status;
}

async function toggleHot(p: Property) {
  await api.put(`/admin/properties/${p.id}`, { hot: p.hot === 1 ? 0 : 1 });
  p.hot = p.hot === 1 ? 0 : 1;
}

async function deleteProperty(p: Property) {
  if (!confirm(`确认删除「${p.title}」？`)) return;
  await api.delete(`/admin/properties/${p.id}`);
  fetchList();
}

onMounted(fetchList);
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.toolbar input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
}
.property-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.property-table th, .property-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}
.property-table th {
  background: var(--color-primary);
  color: #fff;
}
.btn-small {
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  margin-right: 4px;
}
.btn-small.danger {
  color: #E64A19;
  border-color: #E64A19;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
}
.modal h3 {
  margin-bottom: 16px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.field {
  margin-bottom: 12px;
}
.field label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}
.field input, .field select, .field textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
}
.image-preview {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.preview-item {
  position: relative;
  width: 80px;
  height: 80px;
}
.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}
.preview-item button {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #E64A19;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .property-table {
    font-size: 12px;
  }
  .property-table th, .property-table td {
    padding: 8px 4px;
  }
}
</style>
