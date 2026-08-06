document.addEventListener("DOMContentLoaded", () => {
  try {
    const state = {
      tasks:
        typeof initialTaskData !== "undefined"
          ? JSON.parse(JSON.stringify(initialTaskData))
          : [],

      filteredTasks: [],

      sortKey: null,
      sortDir: "none",

      filterWeek: "all",
      filterStatus: "all",
      searchTerm: "",

      taskEditingId: null,
      taskDeletingId: null,
    };

    const elements = {
      table: document.getElementById("taskTable"),
      tableBody: document.getElementById("tableBody"),
      emptyState: document.getElementById("emptyState"),
      showingCount: document.getElementById("showingCount"),
      tableHeaders: document.querySelectorAll("#taskTable th[data-sort-key]"),

      filterWeek: document.getElementById("filterWeek"),
      filterStatus: document.getElementById("filterStatus"),
      searchInput: document.getElementById("searchInput"),
      resetFiltersBtn: document.getElementById("resetFiltersBtn"),
      emptyResetBtn: document.getElementById("emptyResetBtn"),
      exportModalBtn: document.getElementById("exportModalBtn"),
      addTaskBtn: document.getElementById("addTaskBtn"),

      statTotalTasks: document.getElementById("statTotalTasks"),
      statTotalHours: document.getElementById("statTotalHours"),
      statCompletedTasks: document.getElementById("statCompletedTasks"),
      statActiveTasks: document.getElementById("statActiveTasks"),

      themeToggleBtn: document.getElementById("themeToggleBtn"),
      themeIconSun: document.getElementById("themeIconSun"),
      themeIconMoon: document.getElementById("themeIconMoon"),

      taskModal: document.getElementById("taskModal"),
      modalTitle: document.getElementById("modalTitle"),
      taskForm: document.getElementById("taskForm"),
      taskIdInput: document.getElementById("taskIdInput"),
      taskNameInput: document.getElementById("taskNameInput"),
      taskStatusInput: document.getElementById("taskStatusInput"),
      taskHoursInput: document.getElementById("taskHoursInput"),
      taskWeekInput: document.getElementById("taskWeekInput"),
      taskNotesInput: document.getElementById("taskNotesInput"),
      cancelTaskBtn: document.getElementById("cancelTaskBtn"),
      closeTaskModalBtn: document.getElementById("closeTaskModalBtn"),

      taskNameError: document.getElementById("taskNameError"),
      taskStatusError: document.getElementById("taskStatusError"),
      taskHoursError: document.getElementById("taskHoursError"),
      taskWeekError: document.getElementById("taskWeekError"),

      deleteModal: document.getElementById("deleteModal"),
      deleteTaskNameDisplay: document.getElementById("deleteTaskNameDisplay"),
      confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),
      cancelDeleteBtn: document.getElementById("cancelDeleteBtn"),
      closeDeleteModalBtn: document.getElementById("closeDeleteModalBtn"),

      exportModal: document.getElementById("exportModal"),
      exportScopeSelect: document.getElementById("exportScopeSelect"),
      exportFormatSelect: document.getElementById("exportFormatSelect"),
      doExportBtn: document.getElementById("doExportBtn"),
      cancelExportBtn: document.getElementById("cancelExportBtn"),
      closeExportModalBtn: document.getElementById("closeExportModalBtn"),

      toastContainer: document.getElementById("toastContainer"),
    };

    /**
     * @param {string} message
     * @param {string} type
     * @param {number} duration
     */
    function showToast(message, type = "success", duration = 3200) {
      try {
        if (!elements.toastContainer) return;

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;

        let icon = "ℹ️";
        if (type === "success") icon = "✅";
        if (type === "error") icon = "❌";
        if (type === "warning") icon = "⚠️";

        toast.innerHTML = `<span>${icon}</span> <span>${escapeHTML(message)}</span>`;

        elements.toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
          toast.classList.add("show");
        });

        setTimeout(() => {
          toast.classList.remove("show");
          toast.addEventListener("transitionend", () => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          });
        }, duration);
      } catch (err) {
        console.error("Error displaying toast:", err);
      }
    }

    function initTheme() {
      try {
        const savedTheme = localStorage.getItem("app-theme");
        let activeTheme = "light";

        if (savedTheme === "dark" || savedTheme === "light") {
          activeTheme = savedTheme;
        } else if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          activeTheme = "dark";
        }

        applyTheme(activeTheme);
      } catch (err) {
        console.error("Error initializing theme:", err);
      }
    }

    function applyTheme(theme) {
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        elements.themeIconSun.style.display = "block";
        elements.themeIconMoon.style.display = "none";
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        elements.themeIconSun.style.display = "none";
        elements.themeIconMoon.style.display = "block";
      }
      localStorage.setItem("app-theme", theme);
    }

    function toggleTheme() {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
    }

    function applyFilters() {
      try {
        state.filteredTasks = state.tasks.filter((task) => {
          const matchesWeek =
            state.filterWeek === "all" ||
            task.weekNumber.toString() === state.filterWeek;

          const matchesStatus =
            state.filterStatus === "all" || task.status === state.filterStatus;

          const query = state.searchTerm.trim().toLowerCase();
          const matchesSearch =
            !query ||
            task.taskName.toLowerCase().includes(query) ||
            (task.notes && task.notes.toLowerCase().includes(query));

          return matchesWeek && matchesStatus && matchesSearch;
        });

        if (state.sortKey && state.sortDir !== "none") {
          sortData(state.sortKey, false);
        } else {
          render();
        }
      } catch (err) {
        console.error("Error applying filters:", err);
      }
    }

    function sortData(key, toggleDirection = true) {
      try {
        if (toggleDirection) {
          if (state.sortKey === key) {
            if (state.sortDir === "asc") {
              state.sortDir = "desc";
            } else if (state.sortDir === "desc") {
              state.sortDir = "none";
              state.sortKey = null;
            } else {
              state.sortDir = "asc";
            }
          } else {
            state.sortKey = key;
            state.sortDir = "asc";
          }
        }

        if (state.sortKey && state.sortDir !== "none") {
          state.filteredTasks.sort((a, b) => {
            let valA = a[state.sortKey];
            let valB = b[state.sortKey];

            if (typeof valA === "number" && typeof valB === "number") {
              return state.sortDir === "asc" ? valA - valB : valB - valA;
            }

            valA = (valA || "").toString().toLowerCase();
            valB = (valB || "").toString().toLowerCase();

            if (valA < valB) return state.sortDir === "asc" ? -1 : 1;
            if (valA > valB) return state.sortDir === "asc" ? 1 : -1;
            return 0;
          });
        } else {
          state.filteredTasks.sort((a, b) => a.id - b.id);
        }

        render();
      } catch (err) {
        console.error("Error sorting data:", err);
      }
    }

    function updateSortIndicators() {
      elements.tableHeaders.forEach((th) => {
        const key = th.getAttribute("data-sort-key");
        const iconSpan = document.getElementById(`sortIcon_${key}`);

        th.classList.remove("sorted-asc", "sorted-desc");

        if (key === state.sortKey && state.sortDir !== "none") {
          if (state.sortDir === "asc") {
            th.classList.add("sorted-asc");
            th.setAttribute("aria-sort", "ascending");
            if (iconSpan) iconSpan.textContent = " ▲";
          } else {
            th.classList.add("sorted-desc");
            th.setAttribute("aria-sort", "descending");
            if (iconSpan) iconSpan.textContent = " ▼";
          }
        } else {
          th.setAttribute("aria-sort", "none");
          if (iconSpan) iconSpan.textContent = "";
        }
      });
    }

    /**
     * @param {Object|null} taskToEdit
     */
    function openTaskModal(taskToEdit = null) {
      clearFormErrors();
      if (taskToEdit) {
        state.taskEditingId = taskToEdit.id;
        elements.modalTitle.textContent = "Edit Task";
        elements.taskIdInput.value = taskToEdit.id;
        elements.taskNameInput.value = taskToEdit.taskName;
        elements.taskStatusInput.value = taskToEdit.status;
        elements.taskHoursInput.value = taskToEdit.hoursSpent;
        elements.taskWeekInput.value = taskToEdit.weekNumber;
        elements.taskNotesInput.value = taskToEdit.notes || "";
      } else {
        state.taskEditingId = null;
        elements.modalTitle.textContent = "Add New Task";
        elements.taskForm.reset();
        elements.taskIdInput.value = "";
      }
      elements.taskModal.classList.add("active");
      elements.taskModal.setAttribute("aria-hidden", "false");
      elements.taskNameInput.focus();
    }

    function closeTaskModal() {
      elements.taskModal.classList.remove("active");
      elements.taskModal.setAttribute("aria-hidden", "true");
      clearFormErrors();
    }

    function clearFormErrors() {
      [
        elements.taskNameInput,
        elements.taskStatusInput,
        elements.taskHoursInput,
        elements.taskWeekInput,
      ].forEach((inp) => {
        if (inp) inp.classList.remove("is-invalid");
      });
      if (elements.taskNameError) elements.taskNameError.textContent = "";
      if (elements.taskStatusError) elements.taskStatusError.textContent = "";
      if (elements.taskHoursError) elements.taskHoursError.textContent = "";
      if (elements.taskWeekError) elements.taskWeekError.textContent = "";
    }

    function saveTask(e) {
      e.preventDefault();
      try {
        clearFormErrors();
        let isValid = true;

        const nameVal = elements.taskNameInput.value.trim();
        const statusVal = elements.taskStatusInput.value;
        const hoursVal = parseFloat(elements.taskHoursInput.value);
        const weekVal = parseInt(elements.taskWeekInput.value, 10);
        const notesVal = elements.taskNotesInput.value.trim();

        if (!nameVal) {
          elements.taskNameInput.classList.add("is-invalid");
          elements.taskNameError.textContent = "Task name is required.";
          isValid = false;
        }

        if (!statusVal) {
          elements.taskStatusInput.classList.add("is-invalid");
          elements.taskStatusError.textContent =
            "Please select a valid status.";
          isValid = false;
        }

        if (isNaN(hoursVal) || hoursVal < 0) {
          elements.taskHoursInput.classList.add("is-invalid");
          elements.taskHoursError.textContent =
            "Hours spent must be a number >= 0.";
          isValid = false;
        }

        if (isNaN(weekVal) || weekVal < 1 || weekVal > 52) {
          elements.taskWeekInput.classList.add("is-invalid");
          elements.taskWeekError.textContent =
            "Please select a valid week number.";
          isValid = false;
        }

        if (!isValid) return;

        if (state.taskEditingId) {
          const index = state.tasks.findIndex(
            (t) => t.id === state.taskEditingId,
          );
          if (index !== -1) {
            state.tasks[index] = {
              ...state.tasks[index],
              taskName: nameVal,
              status: statusVal,
              hoursSpent: hoursVal,
              weekNumber: weekVal,
              notes: notesVal,
            };
            showToast(`Task "${nameVal}" updated successfully!`, "success");
          }
        } else {
          const maxId = state.tasks.reduce(
            (max, t) => Math.max(max, t.id || 0),
            0,
          );
          const newTask = {
            id: maxId + 1,
            taskName: nameVal,
            status: statusVal,
            hoursSpent: hoursVal,
            weekNumber: weekVal,
            notes: notesVal,
          };
          state.tasks.unshift(newTask);
          showToast(`New task "${nameVal}" added successfully!`, "success");
        }

        closeTaskModal();
        applyFilters();
      } catch (err) {
        console.error("Error saving task:", err);
        showToast("Failed to save task. Please try again.", "error");
      }
    }

    /**
     * @param {number} id
     */
    function openDeleteModal(id) {
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return;

      state.taskDeletingId = id;
      elements.deleteTaskNameDisplay.textContent = `"${task.taskName}" (Week ${task.weekNumber})`;
      elements.deleteModal.classList.add("active");
      elements.deleteModal.setAttribute("aria-hidden", "false");
    }

    function closeDeleteModal() {
      elements.deleteModal.classList.remove("active");
      elements.deleteModal.setAttribute("aria-hidden", "true");
      state.taskDeletingId = null;
    }

    function confirmDeleteTask() {
      try {
        if (!state.taskDeletingId) return;
        const taskToDelete = state.tasks.find(
          (t) => t.id === state.taskDeletingId,
        );
        const taskName = taskToDelete ? taskToDelete.taskName : "Task";

        state.tasks = state.tasks.filter((t) => t.id !== state.taskDeletingId);

        closeDeleteModal();
        applyFilters();
        showToast(`Task "${taskName}" deleted successfully.`, "warning");
      } catch (err) {
        console.error("Error deleting task:", err);
        showToast("Failed to delete task.", "error");
      }
    }

    function openExportModal() {
      elements.exportModal.classList.add("active");
      elements.exportModal.setAttribute("aria-hidden", "false");
    }

    function closeExportModal() {
      elements.exportModal.classList.remove("active");
      elements.exportModal.setAttribute("aria-hidden", "true");
    }

    function executeExport() {
      try {
        const scope = elements.exportScopeSelect.value;
        const format = elements.exportFormatSelect.value;

        let exportTasks = state.tasks.filter((task) => {
          const matchScopeWeek =
            scope === "all" ? true : task.weekNumber.toString() === scope;
          const matchStatus =
            state.filterStatus === "all" || task.status === state.filterStatus;
          const query = state.searchTerm.trim().toLowerCase();
          const matchSearch =
            !query ||
            task.taskName.toLowerCase().includes(query) ||
            (task.notes && task.notes.toLowerCase().includes(query));

          return matchScopeWeek && matchStatus && matchSearch;
        });

        if (!exportTasks || exportTasks.length === 0) {
          showToast("No matching records found for export!", "warning");
          return;
        }

        const timestamp = new Date().toISOString().slice(0, 10);
        const scopeLabel = scope === "all" ? "All-Weeks" : `Week-${scope}`;

        if (format === "csv") {
          const headers = [
            "Task Name",
            "Status",
            "Hours Spent",
            "Notes",
            "Week Number",
          ];
          const escapeCsvCell = (val) => {
            if (val === null || val === undefined) return '""';
            let str = String(val).replace(/"/g, '""');
            return `"${str}"`;
          };

          const csvRows = [headers.map((h) => `"${h}"`).join(",")];
          exportTasks.forEach((t) => {
            csvRows.push(
              [
                escapeCsvCell(t.taskName),
                escapeCsvCell(t.status),
                escapeCsvCell(t.hoursSpent),
                escapeCsvCell(t.notes || ""),
                escapeCsvCell(`Week ${t.weekNumber}`),
              ].join(","),
            );
          });

          const csvString = csvRows.join("\r\n");
          const blob = new Blob(["\uFEFF" + csvString], {
            type: "text/csv;charset=utf-8;",
          });
          downloadFile(blob, `weekly-report-${scopeLabel}-${timestamp}.csv`);

          showToast(
            `Report exported — ${exportTasks.length} records (${scopeLabel.replace("-", " ")})`,
            "success",
          );
        } else if (format === "xls") {
          const columns = [
            { header: "Task Name", key: "taskName" },
            { header: "Status", key: "status" },
            { header: "Hours Spent", key: "hoursSpent" },
            { header: "Notes", key: "notes" },
            { header: "Week Number", key: "weekNumber" },
          ];

          const colWidths = columns.map((col) => {
            let maxLen = col.header.length;
            exportTasks.forEach((t) => {
              let valStr = "";
              if (col.key === "weekNumber") valStr = `Week ${t.weekNumber}`;
              else if (col.key === "hoursSpent")
                valStr = `${Number(t.hoursSpent).toFixed(1)} hrs`;
              else valStr = String(t[col.key] || "");
              maxLen = Math.max(maxLen, valStr.length);
            });

            return Math.min(Math.max(maxLen * 11, 100), 500);
          });

          let tableHtml = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
              <meta charset="utf-8" />
              <!--[if gte mso 9]>
              <xml>
                <x:ExcelWorkbook>
                  <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                      <x:Name>Weekly Report</x:Name>
                      <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                    </x:ExcelWorksheet>
                  </x:ExcelWorksheets>
                </x:ExcelWorkbook>
              </xml>
              <![endif]-->
              <style>
                th { background-color: #2563eb; color: #ffffff; font-weight: bold; text-align: left; padding: 8px; font-family: Arial, sans-serif; }
                td { padding: 6px 8px; vertical-align: top; font-family: Arial, sans-serif; border: 1px solid #e2e8f0; }
                tr:nth-child(even) td { background-color: #f8fafc; }
              </style>
            </head>
            <body>
              <table>
                <colgroup>
                  ${colWidths.map((w) => `<col style="width: ${w}px;" />`).join("")}
                </colgroup>
                <thead>
                  <tr>
                    ${columns.map((c) => `<th>${escapeHTML(c.header)}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${exportTasks
                    .map(
                      (t) => `
                    <tr>
                      <td>${escapeHTML(t.taskName)}</td>
                      <td>${escapeHTML(t.status)}</td>
                      <td>${Number(t.hoursSpent).toFixed(1)} hrs</td>
                      <td>${escapeHTML(t.notes || "")}</td>
                      <td>Week ${t.weekNumber}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </body>
            </html>
          `;

          const blob = new Blob([tableHtml], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          downloadFile(blob, `weekly-report-${scopeLabel}-${timestamp}.xls`);

          showToast(
            `Excel report exported — ${exportTasks.length} records (${scopeLabel.replace("-", " ")})`,
            "success",
          );
        }

        closeExportModal();
      } catch (err) {
        console.error("Error generating export file:", err);
        showToast("Export failed, please try again.", "error");
      }
    }

    function downloadFile(blob, filename) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    function render() {
      try {
        const list = state.filteredTasks;

        const totalCount = list.length;
        const totalHours = list.reduce(
          (sum, task) => sum + (Number(task.hoursSpent) || 0),
          0,
        );
        const completedCount = list.filter(
          (t) => t.status === "Completed",
        ).length;
        const activeCount = list.filter(
          (t) => t.status === "In Progress",
        ).length;

        if (elements.statTotalTasks)
          elements.statTotalTasks.textContent = totalCount;
        if (elements.statTotalHours)
          elements.statTotalHours.textContent = `${totalHours.toFixed(1)} hrs`;
        if (elements.statCompletedTasks)
          elements.statCompletedTasks.textContent = completedCount;
        if (elements.statActiveTasks)
          elements.statActiveTasks.textContent = activeCount;

        if (elements.showingCount) {
          elements.showingCount.textContent = `Showing ${totalCount} of ${state.tasks.length} entries`;
        }

        if (totalCount === 0) {
          elements.table.style.display = "none";
          elements.emptyState.classList.add("visible");
          updateSortIndicators();
          return;
        }

        elements.table.style.display = "table";
        elements.emptyState.classList.remove("visible");

        elements.tableBody.innerHTML = "";
        const fragment = document.createDocumentFragment();

        list.forEach((task) => {
          const tr = document.createElement("tr");

          let statusClass = "status-pending";
          if (task.status === "In Progress") statusClass = "status-in-progress";
          if (task.status === "Completed") statusClass = "status-completed";

          tr.innerHTML = `
            <td data-label="Task Name" class="td-task">${escapeHTML(task.taskName)}</td>
            <td data-label="Status">
              <span class="status-badge ${statusClass}">${escapeHTML(task.status)}</span>
            </td>
            <td data-label="Hours Spent" class="td-hours">${Number(task.hoursSpent).toFixed(1)} hrs</td>
            <td data-label="Notes" class="td-notes">${escapeHTML(task.notes || "-")}</td>
            <td data-label="Week Number" class="td-week">
              <span class="week-pill">Week ${task.weekNumber}</span>
            </td>
            <td data-label="Actions" class="td-actions">
              <div class="action-btn-group">
                <button class="btn-icon edit" data-action="edit" data-id="${task.id}" title="Edit Task">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="btn-icon delete" data-action="delete" data-id="${task.id}" title="Delete Task">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </td>
          `;

          fragment.appendChild(tr);
        });

        elements.tableBody.appendChild(fragment);

        updateSortIndicators();
      } catch (err) {
        console.error("Error rendering application:", err);
      }
    }

    function escapeHTML(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function setupEventListeners() {
      elements.filterWeek.addEventListener("change", (e) => {
        state.filterWeek = e.target.value;
        applyFilters();
      });

      elements.filterStatus.addEventListener("change", (e) => {
        state.filterStatus = e.target.value;
        applyFilters();
      });

      elements.searchInput.addEventListener("input", (e) => {
        state.searchTerm = e.target.value;
        applyFilters();
      });

      const handleReset = () => {
        state.filterWeek = "all";
        state.filterStatus = "all";
        state.searchTerm = "";
        state.sortKey = null;
        state.sortDir = "none";

        elements.filterWeek.value = "all";
        elements.filterStatus.value = "all";
        elements.searchInput.value = "";

        applyFilters();
        showToast("Filters reset to default.", "info");
      };

      elements.resetFiltersBtn.addEventListener("click", handleReset);
      elements.emptyResetBtn.addEventListener("click", handleReset);

      elements.tableHeaders.forEach((th) => {
        const key = th.getAttribute("data-sort-key");

        th.addEventListener("click", () => sortData(key, true));
        th.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            sortData(key, true);
          }
        });
      });

      elements.tableBody.addEventListener("click", (e) => {
        const actionBtn = e.target.closest("[data-action]");
        if (!actionBtn) return;

        const action = actionBtn.getAttribute("data-action");
        const taskId = parseInt(actionBtn.getAttribute("data-id"), 10);

        if (action === "edit") {
          const taskToEdit = state.tasks.find((t) => t.id === taskId);
          if (taskToEdit) openTaskModal(taskToEdit);
        } else if (action === "delete") {
          openDeleteModal(taskId);
        }
      });

      elements.addTaskBtn.addEventListener("click", () => openTaskModal(null));
      elements.cancelTaskBtn.addEventListener("click", closeTaskModal);
      elements.closeTaskModalBtn.addEventListener("click", closeTaskModal);
      elements.taskForm.addEventListener("submit", saveTask);

      elements.cancelDeleteBtn.addEventListener("click", closeDeleteModal);
      elements.closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
      elements.confirmDeleteBtn.addEventListener("click", confirmDeleteTask);

      elements.exportModalBtn.addEventListener("click", openExportModal);
      elements.cancelExportBtn.addEventListener("click", closeExportModal);
      elements.closeExportModalBtn.addEventListener("click", closeExportModal);
      elements.doExportBtn.addEventListener("click", executeExport);

      [elements.taskModal, elements.deleteModal, elements.exportModal].forEach(
        (modal) => {
          modal.addEventListener("click", (e) => {
            if (e.target === modal) {
              modal.classList.remove("active");
              modal.setAttribute("aria-hidden", "true");
            }
          });
        },
      );

      elements.themeToggleBtn.addEventListener("click", toggleTheme);

      if (window.matchMedia) {
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .addEventListener("change", (e) => {
            if (!localStorage.getItem("app-theme")) {
              applyTheme(e.matches ? "dark" : "light");
            }
          });
      }
    }

    initTheme();
    setupEventListeners();
    applyFilters();
  } catch (err) {
    console.error("Fatal initialization error in app.js:", err);
  }
});
