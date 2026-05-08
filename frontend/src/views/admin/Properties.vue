<template>
  <AdminLayout>
    <div class="properties-page">
      <div class="page-header">
        <h1>房源管理</h1>
        <button class="btn-add" @click="showForm = true">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
          新增房源
        </button>
      </div>

      <div class="toolbar">
        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          <input v-model="keyword" placeholder="搜索房源标题或地址..." @keyup.enter="fetchList" />
        </div>
        <span class="list-count">共 {{ list.length }} 条</span>
      </div>

      <div class="table-wrap">
        <table class="property-table">
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
              <td class="cell-title">{{ p.title }}</td>
              <td><span class="type-tag" :class="p.type">{{ p.type }}</span></td>
              <td>{{ p.area }}</td>
              <td class="cell-price">{{ p.price }}</td>
              <td>
                <select :value="p.status" @change="updateStatus(p, ($event.target as HTMLSelectElement).value)" class="status-select">
                  <option>在售</option>
                  <option>已售</option>
                  <option>已租</option>
                </select>
              </td>
              <td>
                <label class="toggle">
                  <input type="checkbox" :checked="p.hot === 1" @change="toggleHot(p)" />
                  <span class="toggle-track"></span>
                </label>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-edit" @click="editProperty(p)" title="编辑">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                  </button>
                  <button class="btn-delete" @click="deleteProperty(p)" title="删除">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!list.length">
              <td colspan="7" class="empty-row">暂无房源数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 新增/编辑弹窗 -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
            <div class="modal">
              <div class="modal-header">
                <h3>{{ editing ? '编辑房源' : '新增房源' }}</h3>
                <button class="modal-close" @click="closeForm">&times;</button>
              </div>
              <form @submit.prevent="submitForm">
                <div class="modal-body">
                  <div class="form-grid">
                    <div class="field">
                      <label>标题 <span class="req">*</span></label>
                      <input v-model="form.title" placeholder="房源标题" required />
                    </div>
                    <div class="field">
                      <label>类型 <span class="req">*</span></label>
                      <select v-model="form.type" required>
                        <option>新房</option>
                        <option>二手房</option>
                        <option>租房</option>
                      </select>
                    </div>
                    <div class="field">
                      <label>区域 <span class="req">*</span></label>
                      <input v-model="form.area" placeholder="如：朝阳区" required />
                    </div>
                    <div class="field">
                      <label>地址 <span class="req">*</span></label>
                      <input v-model="form.address" placeholder="详细地址" required />
                    </div>
                    <div class="field">
                      <label>价格 <span class="req">*</span></label>
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
                  <div class="field full-width">
                    <label>描述</label>
                    <textarea v-model="form.desc" rows="3" placeholder="房源详细描述..."></textarea>
                  </div>
                  <div class="field full-width">
                    <label>图片</label>
                    <div class="upload-area" @click="triggerFileInput">
                      <input ref="fileInput" type="file" accept="image/*" multiple @change="onFileChange" hidden />
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 16V4m0 0L8 8m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"/></svg>
                      <span>点击上传图片</span>
                    </div>
                    <div class="image-preview" v-if="imagePreviews.length">
                      <div v-for="(img, i) in imagePreviews" :key="i" class="preview-item">
                        <img :src="img" />
                        <button type="button" @click="removeImage(i)">&times;</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn-cancel" @click="closeForm">取消</button>
                  <button type="submit" class="btn-submit">{{ editing ? '保存修改' : '确认新增' }}</button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>
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
const fileInput = ref<HTMLInputElement>();

const defaultForm = {
  title: '', type: '二手房', area: '', address: '', price: '',
  area_sqm: '', rooms: '', floor: '', desc: '', hot: 0, status: '在售',
};
const form = ref({ ...defaultForm });

function triggerFileInput() {
  fileInput.value?.click();
}

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
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-header h1 {
  font-family: var(--font-serif);
  font-size: 28px;
  color: var(--color-text);
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #8B6F47, #A68B64);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(139, 111, 71, 0.25);
}
.btn-add:hover {
  background: linear-gradient(135deg, #6B5535, #8B6F47);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139, 111, 71, 0.35);
}
.btn-add svg {
  width: 18px;
  height: 18px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.search-wrap {
  flex: 1;
  position: relative;
  max-width: 400px;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-text-light);
  pointer-events: none;
}
.search-wrap input {
  width: 100%;
  padding: 10px 14px 10px 42px;
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  background: var(--bg-card);
  outline: none;
  transition: all 0.3s;
}
.search-wrap input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.08);
}

.list-count {
  font-size: 13px;
  color: var(--color-text-light);
}

.table-wrap {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.property-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.property-table th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text-secondary);
  background: var(--bg-cream);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}
.property-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border-light);
  transition: background 0.2s;
}
.property-table tbody tr:hover td {
  background: rgba(196, 168, 130, 0.04);
}
.property-table tbody tr:last-child td {
  border-bottom: none;
}

.cell-title {
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cell-price {
  color: var(--color-orange);
  font-weight: 600;
}

.type-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.type-tag.新房 {
  background: rgba(90, 140, 106, 0.1);
  color: #5A8C6A;
}
.type-tag.二手房 {
  background: rgba(139, 111, 71, 0.1);
  color: #8B6F47;
}
.type-tag.租房 {
  background: rgba(90, 127, 168, 0.1);
  color: #5A7FA8;
}

.status-select {
  padding: 5px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 13px;
  background: var(--bg-card);
  cursor: pointer;
  outline: none;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  cursor: pointer;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-track {
  position: absolute;
  inset: 0;
  background: var(--color-border);
  border-radius: 22px;
  transition: all 0.3s;
}
.toggle-track::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
.toggle input:checked + .toggle-track {
  background: linear-gradient(135deg, #D4764E, #E8956E);
}
.toggle input:checked + .toggle-track::after {
  transform: translateX(18px);
}

.actions {
  display: flex;
  gap: 6px;
}
.btn-edit, .btn-delete {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--bg-card);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
}
.btn-edit svg, .btn-delete svg {
  width: 15px;
  height: 15px;
}
.btn-edit {
  color: var(--color-accent);
}
.btn-edit:hover {
  background: rgba(139, 111, 71, 0.08);
  border-color: var(--color-accent);
}
.btn-delete {
  color: #DC2626;
}
.btn-delete:hover {
  background: rgba(220, 38, 38, 0.06);
  border-color: #DC2626;
}

.empty-row {
  text-align: center;
  padding: 40px 16px !important;
  color: var(--color-text-light);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 33, 24, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: var(--bg-card);
  border-radius: 20px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(45, 33, 24, 0.25);
  animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border-light);
  background: linear-gradient(135deg, rgba(196, 168, 130, 0.06), transparent);
}
.modal-header h3 {
  font-family: var(--font-serif);
  font-size: 20px;
  color: var(--color-text);
}
.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 22px;
  color: var(--color-text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.modal-close:hover {
  background: var(--bg-cream);
  color: var(--color-text);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.field {
  display: flex;
  flex-direction: column;
}
.field.full-width {
  margin-bottom: 16px;
}
.field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}
.req {
  color: #DC2626;
}

.field input, .field select, .field textarea {
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  font-size: 14px;
  background: var(--bg-main);
  outline: none;
  transition: all 0.3s;
}
.field input:focus, .field select:focus, .field textarea:focus {
  border-color: var(--color-accent);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.08);
}
.field textarea {
  resize: vertical;
}

.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--color-text-light);
}
.upload-area:hover {
  border-color: var(--color-accent);
  background: rgba(196, 168, 130, 0.04);
  color: var(--color-accent);
}
.upload-area svg {
  width: 28px;
  height: 28px;
}
.upload-area span {
  font-size: 13px;
}

.image-preview {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.preview-item {
  position: relative;
  width: 72px;
  height: 72px;
}
.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--color-border-light);
}
.preview-item button {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #DC2626;
  color: #fff;
  border: 2px solid var(--bg-card);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}
.preview-item button:hover {
  transform: scale(1.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-border-light);
  background: var(--bg-cream);
}

.btn-cancel {
  padding: 10px 24px;
  background: var(--bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text-secondary);
}
.btn-cancel:hover {
  background: var(--bg-main);
}

.btn-submit {
  padding: 10px 28px;
  background: linear-gradient(135deg, #8B6F47, #A68B64);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(139, 111, 71, 0.25);
}
.btn-submit:hover {
  background: linear-gradient(135deg, #6B5535, #8B6F47);
  box-shadow: 0 6px 20px rgba(139, 111, 71, 0.35);
}

/* Modal transitions */
.modal-enter-active {
  transition: opacity 0.3s;
}
.modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal {
  animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .property-table {
    font-size: 13px;
  }
  .property-table th, .property-table td {
    padding: 10px 8px;
  }
  .cell-title {
    max-width: 120px;
  }
  .modal {
    border-radius: 16px;
    max-height: 95vh;
  }
  .modal-body {
    padding: 16px;
  }
}
</style>
