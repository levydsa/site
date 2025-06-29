const std = @import("std");

pub fn build(b: *std.Build) void {
    const qoiz = b.dependency("qoiz", .{}).module("qoiz");

    {
        const qoi = b.addExecutable(.{
            .name = "qoi",
            .root_source_file = b.path("src/zig/qoi.zig"),
            .optimize = .ReleaseSmall,
            .target = b.resolveTargetQuery(.{
                .cpu_arch = .wasm32,
                .os_tag = .freestanding,
            }),
        });

        qoi.root_module.addImport("qoiz", qoiz);
        qoi.root_module.export_symbol_names = &.{
            "decode",
            "alloc",
            "arenaReset",
        };

        qoi.entry = .disabled;
        qoi.rdynamic = true;

        b.installArtifact(qoi);
    }
}
