<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      :class="getModalOverlayClass()"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      data-testid="confirm-dialog"
    >
      <!-- Background overlay -->
      <div :class="getModalBackdropClass()">
        <div :class="getModalBackgroundClass()" @click="$emit('close')"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
          >&#8203;</span
        >

        <!-- Modal panel -->
        <div :class="getModalPanelClass()">
          <div class="sm:flex sm:items-start">
            <div :class="getModalIconContainerClass('danger')">
              <ExclamationTriangleIcon :class="getIconClass('large', 'red')" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 :class="getModalTitleClass()" id="modal-title">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p :class="getModalDescriptionClass()">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
          <div :class="getModalActionsClass()">
            <button
              type="button"
              :class="getConfirmButtonClass()"
              @click="$emit('confirm')"
              data-testid="confirm-delete"
            >
              {{ confirmText }}
            </button>
            <button
              type="button"
              :class="getModalCancelButtonClass()"
              @click="$emit('close')"
              data-testid="cancel-delete"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useUIClasses } from '../composables/useUIClasses'

export default {
  name: 'ConfirmDialog',
  components: {
    ExclamationTriangleIcon,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: 'Delete',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
  },
  emits: ['confirm', 'close'],
  setup() {
    const {
      getModalOverlayClass,
      getModalBackdropClass,
      getModalBackgroundClass,
      getModalPanelClass,
      getModalIconContainerClass,
      getIconClass,
      getModalTitleClass,
      getModalDescriptionClass,
      getModalActionsClass,
      getConfirmButtonClass,
      getModalCancelButtonClass,
    } = useUIClasses()

    return {
      getModalOverlayClass,
      getModalBackdropClass,
      getModalBackgroundClass,
      getModalPanelClass,
      getModalIconContainerClass,
      getIconClass,
      getModalTitleClass,
      getModalDescriptionClass,
      getModalActionsClass,
      getConfirmButtonClass,
      getModalCancelButtonClass,
    }
  },
}
</script>
